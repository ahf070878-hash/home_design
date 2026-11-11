import { timingSafeEqual } from "node:crypto";
import { stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MEDIA_DIRECTORY = join(process.cwd(), "public", "uploads", "media");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

function isAuthorized(request: Request) {
  const expected = process.env.SETTINGS_ADMIN_TOKEN;
  if (process.env.NODE_ENV !== "production" && !expected) return true;
  if (!expected) return false;
  const supplied = request.headers.get("x-settings-token") ?? "";
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

function mediaFileName(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/uploads/media/")) return null;
  try {
    const fileName = decodeURIComponent(value.slice("/uploads/media/".length));
    if (!fileName || fileName.startsWith(".") || basename(fileName) !== fileName || !IMAGE_EXTENSIONS.has(extname(fileName).toLowerCase())) return null;
    return fileName;
  } catch {
    return null;
  }
}

export async function GET() {
  const designs = await prisma.design.findMany({
    orderBy: [{ type: "asc" }, { name: "asc" }],
    select: { id: true, code: true, name: true, type: true, style: true, mainImageUrl: true, mediaPackageName: true, galleryImageUrls: true, isActive: true },
  });
  return NextResponse.json({ designs }, { headers: { "cache-control": "no-store" } });
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Token pengaturan tidak valid." }, { status: 401 });
  const body = await request.json().catch(() => null) as { id?: unknown; mainImageUrl?: unknown } | null;
  if (typeof body?.id !== "string" || !body.id) return NextResponse.json({ error: "Desain tidak valid." }, { status: 400 });
  const fileName = mediaFileName(body.mainImageUrl);
  if (!fileName) return NextResponse.json({ error: "Pilih gambar dari Pustaka Aset." }, { status: 400 });

  try {
    const details = await stat(join(MEDIA_DIRECTORY, fileName));
    if (!details.isFile()) throw new Error("NOT_A_FILE");
    const design = await prisma.design.update({
      where: { id: body.id },
      data: { mainImageUrl: body.mainImageUrl as string },
      select: { id: true, code: true, name: true, type: true, style: true, mainImageUrl: true, mediaPackageName: true, galleryImageUrls: true, isActive: true },
    });
    return NextResponse.json({ design });
  } catch {
    return NextResponse.json({ error: "Desain atau file media tidak ditemukan." }, { status: 404 });
  }
}
