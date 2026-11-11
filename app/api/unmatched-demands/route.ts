import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Payload permintaan tidak valid." }, { status: 400 });
  const data = body as Record<string, unknown>;
  const city = typeof data.city === "string" ? data.city.trim() : "";
  const category = typeof data.category === "string" ? data.category.trim() : "";
  if (!city || !category) return NextResponse.json({ error: "Kota dan kategori material wajib diisi." }, { status: 400 });
  const demand = await prisma.unmatchedCityDemand.create({ data: {
    userId: typeof data.userId === "string" ? data.userId : undefined,
    guestSessionId: typeof data.guestSessionId === "string" ? data.guestSessionId : undefined,
    city, category,
    requestedBrand: typeof data.requestedBrand === "string" ? data.requestedBrand.trim() : undefined,
    designId: typeof data.designId === "string" ? data.designId : undefined,
  }});
  return NextResponse.json({ demand }, { status: 201 });
}
