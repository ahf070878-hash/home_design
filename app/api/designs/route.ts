import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const width = Number(request.nextUrl.searchParams.get("width"));
  const length = Number(request.nextUrl.searchParams.get("length"));
  const hasLand = Number.isFinite(width) && width > 0 && Number.isFinite(length) && length > 0;
  const designs = await prisma.design.findMany({ where: { isActive: true }, orderBy: [{ type: "asc" }, { name: "asc" }] });

  return NextResponse.json({
    designs: designs.map((design) => {
      const widthShortfall = hasLand ? Math.max(0, Number(design.minLandWidthM) - width) : 0;
      const lengthShortfall = hasLand ? Math.max(0, Number(design.minLandLengthM) - length) : 0;
      return {
        id: design.id,
        name: design.name,
        type: design.type,
        style: design.style,
        width: Number(design.minLandWidthM),
        length: Number(design.minLandLengthM),
        floors: design.floors,
        bedrooms: design.bedrooms,
        bathrooms: design.bathrooms,
        price: Number(design.blueprintPrice),
        baseRab: Number(design.baseRab),
        image: design.mainImageUrl,
        mediaPackageName: design.mediaPackageName,
        galleryImages: design.galleryImageUrls,
        facadeVariants: Array.isArray(design.facadeVariants) ? design.facadeVariants : [],
        layoutVariants: Array.isArray(design.layoutVariants) ? design.layoutVariants : [],
        fitsLand: hasLand ? widthShortfall === 0 && lengthShortfall === 0 : null,
        widthShortfall,
        lengthShortfall,
      };
    }),
  }, { headers: { "cache-control": "no-store" } });
}
