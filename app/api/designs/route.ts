import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticatedCustomer, audienceAllows } from "@/lib/customer-audience";
import { listMediaAssets } from "@/lib/media-storage";

export async function GET(request: NextRequest) {
  const width = Number(request.nextUrl.searchParams.get("width"));
  const length = Number(request.nextUrl.searchParams.get("length"));
  const hasLand = Number.isFinite(width) && width > 0 && Number.isFinite(length) && length > 0;
  const designs = await prisma.design.findMany({ where: { isActive: true }, orderBy: [{ type: "asc" }, { name: "asc" }] });
  const authenticated = isAuthenticatedCustomer(request);
  const assets = await listMediaAssets();
  const visibilityByUrl = new Map(assets.map((asset) => [asset.url, audienceAllows(asset.audience, authenticated)]));
  const canShow = (url: string) => !url.startsWith("/api/media/") || visibilityByUrl.get(url) !== false;

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
        image: canShow(design.mainImageUrl) ? design.mainImageUrl : "/assets/hidden-media.svg",
        mediaPackageName: design.mediaPackageName,
        mediaPackageCaption: design.mediaPackageCaption,
        galleryImages: design.galleryImageUrls.filter(canShow),
        facadeVariants: Array.isArray(design.facadeVariants) ? design.facadeVariants : [],
        layoutVariants: Array.isArray(design.layoutVariants) ? design.layoutVariants : [],
        fitsLand: hasLand ? widthShortfall === 0 && lengthShortfall === 0 : null,
        widthShortfall,
        lengthShortfall,
      };
    }),
  }, { headers: { "cache-control": "no-store" } });
}
