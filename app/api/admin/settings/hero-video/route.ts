import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_HERO_MEDIA, HERO_SETTING_KEY, isAllowedMediaUrl, parseHeroMedia } from "@/lib/hero-settings";

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
  const setting = await prisma.siteSetting.findUnique({ where: { key: HERO_SETTING_KEY } });
  return NextResponse.json(parseHeroMedia(setting?.value));
}

export async function PUT(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Token pengaturan tidak valid." }, { status: 401 });
  const body = await request.json().catch(() => null) as { videoUrl?: unknown; posterUrl?: unknown } | null;
  const videoUrl = typeof body?.videoUrl === "string" ? body.videoUrl.trim() : "";
  const posterUrl = typeof body?.posterUrl === "string" ? body.posterUrl.trim() : DEFAULT_HERO_MEDIA.posterUrl;
  if (!videoUrl || videoUrl.length > 2048 || !isAllowedMediaUrl(videoUrl)) return NextResponse.json({ error: "URL video harus berupa path publik (/...) atau URL HTTPS." }, { status: 400 });
  if (!posterUrl || posterUrl.length > 2048 || !isAllowedMediaUrl(posterUrl)) return NextResponse.json({ error: "URL poster harus berupa path publik (/...) atau URL HTTPS." }, { status: 400 });

  const setting = await prisma.siteSetting.upsert({
    where: { key: HERO_SETTING_KEY },
    update: { value: { videoUrl, posterUrl } },
    create: { key: HERO_SETTING_KEY, value: { videoUrl, posterUrl } },
  });
  return NextResponse.json({ ...parseHeroMedia(setting.value), updatedAt: setting.updatedAt });
}
