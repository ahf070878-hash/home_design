import { NextResponse } from "next/server";
import { isSafeMediaFileName, readMediaAsset } from "@/lib/media-storage";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ fileName: string }> }) {
  const { fileName } = await params;
  if (!isSafeMediaFileName(fileName)) return NextResponse.json({ error: "Nama file media tidak valid." }, { status: 400 });
  try {
    const asset = await readMediaAsset(fileName);
    return new Response(new Uint8Array(asset.content), { headers: { "content-type": asset.contentType, "cache-control": "public, max-age=3600" } });
  } catch {
    return NextResponse.json({ error: "File media tidak ditemukan." }, { status: 404 });
  }
}
