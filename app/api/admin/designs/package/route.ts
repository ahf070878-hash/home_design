import { randomUUID, timingSafeEqual } from "node:crypto";
import { extname } from "node:path";
import { NextResponse } from "next/server";
import { deleteMediaAsset, writeMediaAsset } from "@/lib/media-storage";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MIN_PACKAGE_SIZE = 1;
const MAX_PACKAGE_SIZE = 20;
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
]);

function isAuthorized(request: Request) {
  const expected = process.env.SETTINGS_ADMIN_TOKEN;
  if (process.env.NODE_ENV !== "production" && !expected) return true;
  if (!expected) return false;
  const supplied = request.headers.get("x-settings-token") ?? "";
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

function safeStem(value: string) {
  return value.normalize("NFKD").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase().slice(0, 48) || "paket";
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Token pengaturan tidak valid." }, { status: 401 });
  const formData = await request.formData().catch(() => null);
  const designId = formData?.get("designId");
  const packageNameValue = formData?.get("packageName");
  const files = formData?.getAll("files").filter((value): value is File => value instanceof File) ?? [];
  const packageName = typeof packageNameValue === "string" ? packageNameValue.trim() : "";

  if (typeof designId !== "string" || !designId) return NextResponse.json({ error: "Pilih desain untuk paket gambar." }, { status: 400 });
  if (!packageName || packageName.length > 80) return NextResponse.json({ error: "Nama paket wajib diisi dan maksimal 80 karakter." }, { status: 400 });
  if (files.length < MIN_PACKAGE_SIZE || files.length > MAX_PACKAGE_SIZE) return NextResponse.json({ error: `Pilih 1 sampai ${MAX_PACKAGE_SIZE} gambar dalam satu paket.` }, { status: 400 });
  for (const file of files) {
    if (!file.size || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Setiap gambar wajib berisi dan maksimal 15 MB." }, { status: 413 });
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: "Format paket hanya mendukung JPG, PNG, WebP, atau AVIF." }, { status: 415 });
  }

  const design = await prisma.design.findUnique({ where: { id: designId }, select: { id: true, code: true } });
  if (!design) return NextResponse.json({ error: "Desain tidak ditemukan." }, { status: 404 });

  const writtenFiles: string[] = [];
  const galleryImageUrls: string[] = [];

  try {
    for (const [index, file] of files.entries()) {
      const extension = ALLOWED_TYPES.get(file.type) ?? extname(file.name).toLowerCase();
      const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeStem(design.code)}-${safeStem(packageName)}-${index + 1}${extension}`;
      const url = await writeMediaAsset(fileName, Buffer.from(await file.arrayBuffer()), file.type, `${packageName} · ${index + 1}/${files.length}`);
      writtenFiles.push(fileName);
      galleryImageUrls.push(url);
    }

    const updated = await prisma.design.update({
      where: { id: design.id },
      data: { mediaPackageName: packageName, galleryImageUrls, mainImageUrl: galleryImageUrls[0] },
      select: { id: true, code: true, name: true, type: true, style: true, mainImageUrl: true, mediaPackageName: true, galleryImageUrls: true, isActive: true },
    });
    return NextResponse.json({ design: updated, uploadedImages: galleryImageUrls.length }, { status: 201 });
  } catch (error) {
    console.error("Gagal menyimpan paket gambar desain:", error);
    await Promise.all(writtenFiles.map((fileName) => deleteMediaAsset(fileName).catch(() => undefined)));
    return NextResponse.json({ error: "Paket gambar gagal disimpan." }, { status: 500 });
  }
}
