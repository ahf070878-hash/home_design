import { randomUUID, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { deleteMediaAsset, writeMediaAsset } from "@/lib/media-storage";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
const IMAGE_TYPES = new Map([
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

export async function POST(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Token pengaturan tidak valid." }, { status: 401 });

  const designs = await prisma.design.findMany({
    where: { mainImageUrl: { startsWith: "https://images.unsplash.com/" } },
    select: { code: true, mainImageUrl: true },
    orderBy: { code: "asc" },
  });
  if (!designs.length) return NextResponse.json({ importedImages: 0, updatedDesigns: 0 });

  const downloadedFiles: string[] = [];
  const localUrlByRemote = new Map<string, string>();

  try {
    for (const design of designs) {
      if (localUrlByRemote.has(design.mainImageUrl)) continue;
      const response = await fetch(design.mainImageUrl, { signal: AbortSignal.timeout(30_000) });
      if (!response.ok) throw new Error("DOWNLOAD_FAILED");
      const contentType = response.headers.get("content-type")?.split(";")[0] ?? "";
      const extension = IMAGE_TYPES.get(contentType);
      if (!extension) throw new Error("UNSUPPORTED_IMAGE");
      const contentLength = Number(response.headers.get("content-length") ?? 0);
      if (contentLength > MAX_IMAGE_SIZE) throw new Error("IMAGE_TOO_LARGE");
      const buffer = Buffer.from(await response.arrayBuffer());
      if (!buffer.length || buffer.length > MAX_IMAGE_SIZE) throw new Error("IMAGE_TOO_LARGE");

      const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}-katalog-${design.code.toLowerCase()}${extension}`;
      const localUrl = await writeMediaAsset(fileName, buffer, contentType, `Katalog ${design.code}`);
      downloadedFiles.push(fileName);
      localUrlByRemote.set(design.mainImageUrl, localUrl);
    }

    await prisma.$transaction([...localUrlByRemote.entries()].map(([remoteUrl, localUrl]) => prisma.design.updateMany({
      where: { mainImageUrl: remoteUrl },
      data: { mainImageUrl: localUrl },
    })));
    return NextResponse.json({ importedImages: localUrlByRemote.size, updatedDesigns: designs.length });
  } catch {
    await Promise.all(downloadedFiles.map((fileName) => deleteMediaAsset(fileName).catch(() => undefined)));
    return NextResponse.json({ error: "Gambar katalog gagal diimpor. Periksa koneksi internet lalu coba kembali." }, { status: 502 });
  }
}
