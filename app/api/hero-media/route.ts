import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HERO_SETTING_KEY, parseHeroMedia } from "@/lib/hero-settings";

export async function GET() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: HERO_SETTING_KEY } });
  return NextResponse.json(parseHeroMedia(setting?.value));
}
