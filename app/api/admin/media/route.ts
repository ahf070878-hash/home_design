import { randomUUID, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MEDIA_DIRECTORY = join(process.cwd(), "public", "uploads", "media");
const MEDIA_METADATA_FILE = join(MEDIA_DIRECTORY, ".media-library.json");
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const MAX_DISPLAY_NAME_LENGTH = 120;
const ALLOWED_TYPES: ReadonlyMap<string, { extension: string; kind: "image" | "video" }> = new Map([
  ["image/jpeg", { extension: ".jpg", kind: "image" }],
  ["image/png", { extension: ".png", kind: "image" }],
  ["image/webp", { extension: ".webp", kind: "image" }],
  ["image/avif", { extension: ".avif", kind: "image" }],
  ["image/gif", { extension: ".gif", kind: "image" }],
  ["video/mp4", { extension: ".mp4", kind: "video" }],
  ["video/webm", { extension: ".webm", kind: "video" }],
  ["video/quicktime", { extension: ".mov", kind: "video" }],
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
  return fileName
    .replace(extname(fileName), "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 48) || "media";
}

type MediaMetadata = Record<string, { displayName: string }>;

async function readMetadata(): Promise<MediaMetadata> {
  try {
    const file = await readFile(MEDIA_METADATA_FILE, "utf8");
    const value: unknown = JSON.parse(file);
    return value && typeof value === "object" && !Array.isArray(value) ? value as MediaMetadata : {};
  } catch {
    return {};
  }
}

async function writeMetadata(metadata: MediaMetadata) {
  await writeFile(MEDIA_METADATA_FILE, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
}

function isSafeFileName(value: unknown): value is string {
  return typeof value === "string"
    && value.length > 0
    && value.length <= 255
    && !value.startsWith(".")
    && basename(value) === value;
}

function normalizeDisplayName(value: unknown) {
  if (typeof value !== "string") return null;
  const displayName = value.trim();
  if (!displayName || displayName.length > MAX_DISPLAY_NAME_LENGTH || /[\u0000-\u001f\u007f]/.test(displayName)) return null;
  return displayName;
}

async function getMediaAsset(fileName: string, metadata: MediaMetadata) {
  const details = await stat(join(MEDIA_DIRECTORY, fileName));
  if (!details.isFile()) throw new Error("NOT_A_FILE");
  const extension = extname(fileName).toLowerCase();
  return {
    fileName,
    displayName: metadata[fileName]?.displayName ?? fileName,
    url: `/uploads/media/${encodeURIComponent(fileName)}`,
    kind: [".mp4", ".webm", ".mov"].includes(extension) ? "video" as const : "image" as const,
    size: details.size,
    modifiedAt: details.mtime.toISOString(),
  };
}

async function listMedia() {
  await mkdir(MEDIA_DIRECTORY, { recursive: true });
  const names = await readdir(MEDIA_DIRECTORY);
  const metadata = await readMetadata();
  const assets = await Promise.all(names.filter((name) => !name.startsWith(".")).map((fileName) => getMediaAsset(fileName, metadata)));
  return assets.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
}

export async function GET() {
  return NextResponse.json({ assets: await listMedia() }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Token pengaturan tidak valid." }, { status: 401 });
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_FILE_SIZE + 1024 * 1024) return NextResponse.json({ error: "Ukuran file maksimal 100 MB." }, { status: 413 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Pilih file gambar atau video untuk di-upload." }, { status: 400 });
  if (!file.size) return NextResponse.json({ error: "File kosong tidak dapat di-upload." }, { status: 400 });
  if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Ukuran file maksimal 100 MB." }, { status: 413 });

  const mediaType = ALLOWED_TYPES.get(file.type);
  if (!mediaType) return NextResponse.json({ error: "Format file tidak didukung. Gunakan JPG, PNG, WebP, AVIF, GIF, MP4, WebM, atau MOV." }, { status: 415 });

  await mkdir(MEDIA_DIRECTORY, { recursive: true });
  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeStem(file.name)}${mediaType.extension}`;
  await writeFile(join(MEDIA_DIRECTORY, fileName), Buffer.from(await file.arrayBuffer()), { flag: "wx" });
  const metadata = await readMetadata();
  metadata[fileName] = { displayName: file.name };
  await writeMetadata(metadata);

  return NextResponse.json({
    asset: {
      fileName,
      displayName: file.name,
      url: `/uploads/media/${encodeURIComponent(fileName)}`,
      kind: mediaType.kind,
      size: file.size,
      modifiedAt: new Date().toISOString(),
    },
  }, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Token pengaturan tidak valid." }, { status: 401 });

  const body = await request.json().catch(() => null) as { fileName?: unknown; displayName?: unknown } | null;
  if (!isSafeFileName(body?.fileName)) return NextResponse.json({ error: "Nama file media tidak valid." }, { status: 400 });
  const displayName = normalizeDisplayName(body?.displayName);
  if (!displayName) return NextResponse.json({ error: `Nama media wajib diisi dan maksimal ${MAX_DISPLAY_NAME_LENGTH} karakter.` }, { status: 400 });

  try {
    const metadata = await readMetadata();
    const asset = await getMediaAsset(body.fileName, metadata);
    metadata[body.fileName] = { displayName };
    await writeMetadata(metadata);
    return NextResponse.json({ asset: { ...asset, displayName } });
  } catch {
    return NextResponse.json({ error: "File media tidak ditemukan." }, { status: 404 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Token pengaturan tidak valid." }, { status: 401 });

  const body = await request.json().catch(() => null) as { fileName?: unknown } | null;
  if (!isSafeFileName(body?.fileName)) return NextResponse.json({ error: "Nama file media tidak valid." }, { status: 400 });

  try {
    const mediaUrl = `/uploads/media/${encodeURIComponent(body.fileName)}`;
    const usedByDesign = await prisma.design.findFirst({ where: { OR: [{ mainImageUrl: mediaUrl }, { galleryImageUrls: { has: mediaUrl } }] }, select: { code: true, name: true } });
    if (usedByDesign) return NextResponse.json({ error: `Media sedang dipakai oleh ${usedByDesign.code} · ${usedByDesign.name}. Ganti gambar produk terlebih dahulu.` }, { status: 409 });
    await unlink(join(MEDIA_DIRECTORY, body.fileName));
    const metadata = await readMetadata();
    delete metadata[body.fileName];
    await writeMetadata(metadata);
    return NextResponse.json({ deleted: true, fileName: body.fileName });
  } catch {
    return NextResponse.json({ error: "File media tidak ditemukan." }, { status: 404 });
  }
}
