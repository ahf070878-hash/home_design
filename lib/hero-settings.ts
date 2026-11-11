import type { Prisma } from "@/generated/prisma/client";

export const HERO_SETTING_KEY = "hero_media";

export const DEFAULT_HERO_MEDIA = {
  videoUrl: "/assets/hero/home-design.mp4",
  posterUrl: "/assets/hero/home-design-poster.jpg",
} as const;

export type HeroMedia = {
  videoUrl: string;
  posterUrl: string;
};

export function parseHeroMedia(value: Prisma.JsonValue | null | undefined): HeroMedia {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ...DEFAULT_HERO_MEDIA };
  const videoUrl = typeof value.videoUrl === "string" ? value.videoUrl : DEFAULT_HERO_MEDIA.videoUrl;
  const posterUrl = typeof value.posterUrl === "string" ? value.posterUrl : DEFAULT_HERO_MEDIA.posterUrl;
  return { videoUrl, posterUrl };
}

export function isAllowedMediaUrl(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || (process.env.NODE_ENV !== "production" && url.protocol === "http:");
  } catch {
    return false;
  }
}
