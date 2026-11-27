import { NextResponse } from "next/server";
import { isAuthenticatedCustomer, audienceAllows } from "@/lib/customer-audience";
import { isAdminMutationAuthorized, readAdminSessionFromRequest } from "@/lib/admin-auth";
import { isSafeMediaFileName, listMediaAssets, readMediaAsset } from "@/lib/media-storage";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ fileName: string }> }) {
  const { fileName } = await params;
  if (!isSafeMediaFileName(fileName)) return NextResponse.json({ error: "Nama file media tidak valid." }, { status: 400 });
  try {
    const asset = (await listMediaAssets()).find((item) => item.fileName === fileName);
    if (!asset) return NextResponse.json({ error: "File media tidak ditemukan." }, { status: 404 });
    const isAdmin = Boolean(readAdminSessionFromRequest(request)) || isAdminMutationAuthorized(request);
    if (!isAdmin && !audienceAllows(asset.audience, isAuthenticatedCustomer(request))) {
      const message = asset.audience === "PAID" ? "Desain ini hanya tersedia untuk pelanggan yang sudah membeli paket." : "File media tidak tersedia untuk akun ini.";
      return NextResponse.json({ error: message }, { status: 403 });
    }
    const content = await readMediaAsset(fileName);
    return new Response(new Uint8Array(content.content), { headers: { "content-type": content.contentType, "cache-control": asset.audience === "PAID" ? "private, no-store" : "public, max-age=3600" } });
  } catch {
    return NextResponse.json({ error: "File media tidak ditemukan." }, { status: 404 });
  }
}
