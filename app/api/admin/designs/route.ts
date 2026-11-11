import { basename, extname } from "node:path";
import { NextResponse } from "next/server";
import { isAdminMutationAuthorized } from "@/lib/admin-auth";
import { mediaAssetExists } from "@/lib/media-storage";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

function mediaFileName(value: unknown) {
  if (typeof value !== "string") return null;
  const prefix = value.startsWith("/api/media/") ? "/api/media/" : value.startsWith("/uploads/media/") ? "/uploads/media/" : null;
  if (!prefix) return null;
  try {
    const fileName = decodeURIComponent(value.slice(prefix.length));
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
  if (!isAdminMutationAuthorized(request)) return NextResponse.json({ error: "Sesi atau token admin tidak valid." }, { status: 401 });
  const body = await request.json().catch(() => null) as { id?: unknown; mainImageUrl?: unknown } | null;
  if (typeof body?.id !== "string" || !body.id) return NextResponse.json({ error: "Desain tidak valid." }, { status: 400 });
  const fileName = mediaFileName(body.mainImageUrl);
  if (!fileName) return NextResponse.json({ error: "Pilih gambar dari Pustaka Aset." }, { status: 400 });

  try {
    if (!await mediaAssetExists(fileName)) throw new Error("NOT_A_FILE");
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
