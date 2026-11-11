import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTypography, TYPOGRAPHY_SETTING_KEY } from "@/lib/site-typography";

function isAuthorized(request: Request) {
  const expected = process.env.SETTINGS_ADMIN_TOKEN;
  if (process.env.NODE_ENV !== "production" && !expected) return true;
  if (!expected) return false;
  const supplied = request.headers.get("x-settings-token") ?? "";
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export async function GET() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: TYPOGRAPHY_SETTING_KEY } });
  return NextResponse.json(parseTypography(setting?.value));
}

export async function PUT(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Token pengaturan tidak valid." }, { status: 401 });
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
