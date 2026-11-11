import { NextResponse } from "next/server";
import { isAdminMutationAuthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseTypography, TYPOGRAPHY_SETTING_KEY } from "@/lib/site-typography";

export async function GET() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: TYPOGRAPHY_SETTING_KEY } });
  return NextResponse.json(parseTypography(setting?.value));
}

export async function PUT(request: Request) {
  if (!isAdminMutationAuthorized(request)) return NextResponse.json({ error: "Sesi atau token admin tidak valid." }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Data tipografi tidak valid." }, { status: 400 });
  const typography = parseTypography(body);
  const setting = await prisma.siteSetting.upsert({
    where: { key: TYPOGRAPHY_SETTING_KEY },
    update: { value: typography },
    create: { key: TYPOGRAPHY_SETTING_KEY, value: typography },
  });
  return NextResponse.json({ ...parseTypography(setting.value), updatedAt: setting.updatedAt });
}
