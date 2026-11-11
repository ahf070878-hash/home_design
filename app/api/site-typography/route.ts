import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTypography, TYPOGRAPHY_SETTING_KEY } from "@/lib/site-typography";

export async function GET() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: TYPOGRAPHY_SETTING_KEY } });
  return NextResponse.json(parseTypography(setting?.value));
}
