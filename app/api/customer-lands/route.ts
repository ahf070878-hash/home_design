import { NextResponse } from "next/server";
import { LandRequestStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Payload lahan tidak valid." }, { status: 400 });
  const data = body as Record<string, unknown>;
  const widthM = Number(data.widthM);
  const lengthM = Number(data.lengthM);
  const city = typeof data.city === "string" ? data.city.trim() : "";
  if (!(widthM > 0) || !(lengthM > 0) || !city) return NextResponse.json({ error: "Lebar, panjang, dan kota wajib diisi." }, { status: 400 });

  const fitCount = await prisma.design.count({
    where: { isActive: true, minLandWidthM: { lte: widthM }, minLandLengthM: { lte: lengthM } },
  });
  const status = fitCount > 0 ? LandRequestStatus.MATCHED : LandRequestStatus.UNFULFILLED;
  const land = await prisma.customerLand.create({ data: {
    userId: typeof data.userId === "string" ? data.userId : undefined,
    guestSessionId: typeof data.guestSessionId === "string" ? data.guestSessionId : undefined,
    widthM, lengthM, city,
    district: typeof data.district === "string" ? data.district.trim() : undefined,
    requestNote: typeof data.requestNote === "string" ? data.requestNote.trim() : undefined,
    status,
  }});
  return NextResponse.json({ land, fitCount }, { status: 201 });
}
