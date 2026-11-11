import { randomUUID, timingSafeEqual } from "node:crypto";
import { extname } from "node:path";
import { NextResponse } from "next/server";
import { deleteMediaAsset, isSafeMediaFileName, listMediaAssets, mediaUrl, updateMediaDisplayName, writeMediaAsset } from "@/lib/media-storage";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const MAX_DISPLAY_NAME_LENGTH = 120;
const ALLOWED_TYPES: ReadonlyMap<string, { extension: string; kind: "image" | "video" }> = new Map([
  ["image/jpeg", { extension: ".jpg", kind: "image" }], ["image/png", { extension: ".png", kind: "image" }],
  ["image/webp", { extension: ".webp", kind: "image" }], ["image/avif", { extension: ".avif", kind: "image" }],
  ["image/gif", { extension: ".gif", kind: "image" }], ["video/mp4", { extension: ".mp4", kind: "video" }],
  ["video/webm", { extension: ".webm", kind: "video" }], ["video/quicktime", { extension: ".mov", kind: "video" }],
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

function safeStem(fileName: string) {
  return fileName.replace(extname(fileName), "").normalize("NFKD").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase().slice(0, 48) || "media";
}

function normalizeDisplayName(value: unknown) {
  if (typeof value !== "string") return null;
  const displayName = value.trim();
  if (!displayName || displayName.length > MAX_DISPLAY_NAME_LENGTH || /[\u0000-\u001f\u007f]/.test(displayName)) return null;
  return displayName;
}

export async function GET() {
  return NextResponse.json({ assets: await listMediaAssets() }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Token pengaturan tidak valid." }, { status: 401 });
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_FILE_SIZE + 1024 * 1024) return NextResponse.json({ error: "Ukuran file maksimal 100 MB." }, { status: 413 });
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Pilih file gambar atau video untuk di-upload." }, { status: 400 });
  if (!file.size || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Ukuran file wajib berisi dan maksimal 100 MB." }, { status: 413 });
  const mediaType = ALLOWED_TYPES.get(file.type);
  if (!mediaType) return NextResponse.json({ error: "Format file tidak didukung. Gunakan JPG, PNG, WebP, AVIF, GIF, MP4, WebM, atau MOV." }, { status: 415 });

  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeStem(file.name)}${mediaType.extension}`;
  const url = await writeMediaAsset(fileName, Buffer.from(await file.arrayBuffer()), file.type, file.name);
  return NextResponse.json({ asset: { fileName, displayName: file.name, url, kind: mediaType.kind, size: file.size, modifiedAt: new Date().toISOString() } }, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Token pengaturan tidak valid." }, { status: 401 });
  const body = await request.json().catch(() => null) as { fileName?: unknown; displayName?: unknown } | null;
  if (!isSafeMediaFileName(body?.fileName)) return NextResponse.json({ error: "Nama file media tidak valid." }, { status: 400 });
  const displayName = normalizeDisplayName(body?.displayName);
  if (!displayName) return NextResponse.json({ error: `Nama media wajib diisi dan maksimal ${MAX_DISPLAY_NAME_LENGTH} karakter.` }, { status: 400 });
  try {
    const asset = (await listMediaAssets()).find((item) => item.fileName === body.fileName);
    if (!asset) throw new Error("NOT_FOUND");
    await updateMediaDisplayName(body.fileName, displayName);
    return NextResponse.json({ asset: { ...asset, displayName } });
  } catch {
    return NextResponse.json({ error: "File media tidak ditemukan." }, { status: 404 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Token pengaturan tidak valid." }, { status: 401 });
  const body = await request.json().catch(() => null) as { fileName?: unknown } | null;
  if (!isSafeMediaFileName(body?.fileName)) return NextResponse.json({ error: "Nama file media tidak valid." }, { status: 400 });
  try {
    const currentUrl = mediaUrl(body.fileName);
    const legacyUrl = `/uploads/media/${encodeURIComponent(body.fileName)}`;
    const usedByDesign = await prisma.design.findFirst({ where: { OR: [{ mainImageUrl: { in: [currentUrl, legacyUrl] } }, { galleryImageUrls: { has: currentUrl } }, { galleryImageUrls: { has: legacyUrl } }] }, select: { code: true, name: true } });
    if (usedByDesign) return NextResponse.json({ error: `Media sedang dipakai oleh ${usedByDesign.code} · ${usedByDesign.name}. Ganti gambar produk terlebih dahulu.` }, { status: 409 });
    await deleteMediaAsset(body.fileName);
    return NextResponse.json({ deleted: true, fileName: body.fileName });
  } catch {
    return NextResponse.json({ error: "File media tidak ditemukan." }, { status: 404 });
  }
}
