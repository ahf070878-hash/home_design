import { randomUUID, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MEDIA_DIRECTORY = join(process.cwd(), "public", "uploads", "media");
const MEDIA_METADATA_FILE = join(MEDIA_DIRECTORY, ".media-library.json");
const MIN_PACKAGE_SIZE = 1;
const MAX_PACKAGE_SIZE = 20;
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
]);

type MediaMetadata = Record<string, { displayName: string }>;

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

async function readMetadata(): Promise<MediaMetadata> {
  try {
    const value: unknown = JSON.parse(await readFile(MEDIA_METADATA_FILE, "utf8"));
    return value && typeof value === "object" && !Array.isArray(value) ? value as MediaMetadata : {};
  } catch {
    return {};
  }
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

  await mkdir(MEDIA_DIRECTORY, { recursive: true });
  const metadata = await readMetadata();
  const writtenFiles: string[] = [];
  const galleryImageUrls: string[] = [];

  try {
    for (const [index, file] of files.entries()) {
      const extension = ALLOWED_TYPES.get(file.type) ?? extname(file.name).toLowerCase();
      const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeStem(design.code)}-${safeStem(packageName)}-${index + 1}${extension}`;
      const filePath = join(MEDIA_DIRECTORY, fileName);
      await writeFile(filePath, Buffer.from(await file.arrayBuffer()), { flag: "wx" });
      writtenFiles.push(filePath);
      galleryImageUrls.push(`/uploads/media/${encodeURIComponent(fileName)}`);
      metadata[fileName] = { displayName: `${packageName} · ${index + 1}/${files.length}` };
    }

    const updated = await prisma.design.update({
      where: { id: design.id },
      data: { mediaPackageName: packageName, galleryImageUrls, mainImageUrl: galleryImageUrls[0] },
      select: { id: true, code: true, name: true, type: true, style: true, mainImageUrl: true, mediaPackageName: true, galleryImageUrls: true, isActive: true },
    });
    await writeFile(MEDIA_METADATA_FILE, `${JSON.stringify(metadata, null, 2)}\n`, "utf8").catch(() => undefined);
    return NextResponse.json({ design: updated, uploadedImages: galleryImageUrls.length }, { status: 201 });
  } catch (error) {
    console.error("Gagal menyimpan paket gambar desain:", error);
    await Promise.all(writtenFiles.map((filePath) => unlink(filePath).catch(() => undefined)));
    return NextResponse.json({ error: "Paket gambar gagal disimpan." }, { status: 500 });
  }
}
