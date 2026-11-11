import type { Prisma } from "@/generated/prisma/client";

export const TYPOGRAPHY_SETTING_KEY = "site_typography";
export const FONT_WEIGHTS = [400, 500, 600, 700] as const;

export type FontOption = {
  id: string;
  label: string;
  family: string;
  googleFamily?: string;
  category: "sans" | "serif" | "mono";
};

export const FONT_OPTIONS = [
  { id: "apple-sf-pro", label: "SF Pro — Apple", family: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif', category: "sans" },
  { id: "system-ui", label: "System UI", family: 'system-ui, "Segoe UI", sans-serif', category: "sans" },
  { id: "ibm-plex-sans", label: "IBM Plex Sans", family: '"IBM Plex Sans", sans-serif', googleFamily: "IBM Plex Sans", category: "sans" },
  { id: "inter", label: "Inter", family: '"Inter", sans-serif', googleFamily: "Inter", category: "sans" },
  { id: "roboto", label: "Roboto", family: '"Roboto", sans-serif', googleFamily: "Roboto", category: "sans" },
  { id: "open-sans", label: "Open Sans", family: '"Open Sans", sans-serif', googleFamily: "Open Sans", category: "sans" },
  { id: "lato", label: "Lato", family: '"Lato", sans-serif', googleFamily: "Lato", category: "sans" },
  { id: "montserrat", label: "Montserrat", family: '"Montserrat", sans-serif', googleFamily: "Montserrat", category: "sans" },
  { id: "poppins", label: "Poppins", family: '"Poppins", sans-serif', googleFamily: "Poppins", category: "sans" },
  { id: "nunito", label: "Nunito", family: '"Nunito", sans-serif', googleFamily: "Nunito", category: "sans" },
  { id: "nunito-sans", label: "Nunito Sans", family: '"Nunito Sans", sans-serif', googleFamily: "Nunito Sans", category: "sans" },
  { id: "raleway", label: "Raleway", family: '"Raleway", sans-serif', googleFamily: "Raleway", category: "sans" },
  { id: "work-sans", label: "Work Sans", family: '"Work Sans", sans-serif', googleFamily: "Work Sans", category: "sans" },
  { id: "source-sans-3", label: "Source Sans 3", family: '"Source Sans 3", sans-serif', googleFamily: "Source Sans 3", category: "sans" },
  { id: "dm-sans", label: "DM Sans", family: '"DM Sans", sans-serif', googleFamily: "DM Sans", category: "sans" },
  { id: "manrope", label: "Manrope", family: '"Manrope", sans-serif', googleFamily: "Manrope", category: "sans" },
  { id: "plus-jakarta-sans", label: "Plus Jakarta Sans", family: '"Plus Jakarta Sans", sans-serif', googleFamily: "Plus Jakarta Sans", category: "sans" },
  { id: "space-grotesk", label: "Space Grotesk", family: '"Space Grotesk", sans-serif', googleFamily: "Space Grotesk", category: "sans" },
  { id: "outfit", label: "Outfit", family: '"Outfit", sans-serif', googleFamily: "Outfit", category: "sans" },
  { id: "figtree", label: "Figtree", family: '"Figtree", sans-serif', googleFamily: "Figtree", category: "sans" },
  { id: "urbanist", label: "Urbanist", family: '"Urbanist", sans-serif', googleFamily: "Urbanist", category: "sans" },
  { id: "rubik", label: "Rubik", family: '"Rubik", sans-serif', googleFamily: "Rubik", category: "sans" },
  { id: "mulish", label: "Mulish", family: '"Mulish", sans-serif', googleFamily: "Mulish", category: "sans" },
  { id: "ubuntu", label: "Ubuntu", family: '"Ubuntu", sans-serif', googleFamily: "Ubuntu", category: "sans" },
  { id: "karla", label: "Karla", family: '"Karla", sans-serif', googleFamily: "Karla", category: "sans" },
  { id: "cabin", label: "Cabin", family: '"Cabin", sans-serif', googleFamily: "Cabin", category: "sans" },
  { id: "barlow", label: "Barlow", family: '"Barlow", sans-serif', googleFamily: "Barlow", category: "sans" },
  { id: "archivo", label: "Archivo", family: '"Archivo", sans-serif', googleFamily: "Archivo", category: "sans" },
  { id: "lexend", label: "Lexend", family: '"Lexend", sans-serif', googleFamily: "Lexend", category: "sans" },
  { id: "libre-franklin", label: "Libre Franklin", family: '"Libre Franklin", sans-serif', googleFamily: "Libre Franklin", category: "sans" },
  { id: "noto-sans", label: "Noto Sans", family: '"Noto Sans", sans-serif', googleFamily: "Noto Sans", category: "sans" },
  { id: "merriweather", label: "Merriweather", family: '"Merriweather", serif', googleFamily: "Merriweather", category: "serif" },
  { id: "lora", label: "Lora", family: '"Lora", serif', googleFamily: "Lora", category: "serif" },
  { id: "playfair-display", label: "Playfair Display", family: '"Playfair Display", serif', googleFamily: "Playfair Display", category: "serif" },
  { id: "libre-baskerville", label: "Libre Baskerville", family: '"Libre Baskerville", serif', googleFamily: "Libre Baskerville", category: "serif" },
  { id: "source-serif-4", label: "Source Serif 4", family: '"Source Serif 4", serif', googleFamily: "Source Serif 4", category: "serif" },
  { id: "cormorant-garamond", label: "Cormorant Garamond", family: '"Cormorant Garamond", serif', googleFamily: "Cormorant Garamond", category: "serif" },
  { id: "crimson-pro", label: "Crimson Pro", family: '"Crimson Pro", serif', googleFamily: "Crimson Pro", category: "serif" },
  { id: "eb-garamond", label: "EB Garamond", family: '"EB Garamond", serif', googleFamily: "EB Garamond", category: "serif" },
  { id: "newsreader", label: "Newsreader", family: '"Newsreader", serif', googleFamily: "Newsreader", category: "serif" },
  { id: "roboto-slab", label: "Roboto Slab", family: '"Roboto Slab", serif', googleFamily: "Roboto Slab", category: "serif" },
  { id: "noto-serif", label: "Noto Serif", family: '"Noto Serif", serif', googleFamily: "Noto Serif", category: "serif" },
  { id: "bitter", label: "Bitter", family: '"Bitter", serif', googleFamily: "Bitter", category: "serif" },
  { id: "domine", label: "Domine", family: '"Domine", serif', googleFamily: "Domine", category: "serif" },
  { id: "ibm-plex-serif", label: "IBM Plex Serif", family: '"IBM Plex Serif", serif', googleFamily: "IBM Plex Serif", category: "serif" },
  { id: "jetbrains-mono", label: "JetBrains Mono", family: '"JetBrains Mono", monospace', googleFamily: "JetBrains Mono", category: "mono" },
  { id: "ibm-plex-mono", label: "IBM Plex Mono", family: '"IBM Plex Mono", monospace', googleFamily: "IBM Plex Mono", category: "mono" },
  { id: "space-mono", label: "Space Mono", family: '"Space Mono", monospace', googleFamily: "Space Mono", category: "mono" },
  { id: "roboto-mono", label: "Roboto Mono", family: '"Roboto Mono", monospace', googleFamily: "Roboto Mono", category: "mono" },
  { id: "source-code-pro", label: "Source Code Pro", family: '"Source Code Pro", monospace', googleFamily: "Source Code Pro", category: "mono" },
] as const satisfies readonly FontOption[];

export const DEFAULT_TYPOGRAPHY = {
  bodyFontId: "ibm-plex-sans",
  displayFontId: "newsreader",
  bodySizePx: 16,
  displaySizePx: 84,
  textColor: "#17382e",
  bodyWeight: 400,
  displayWeight: 700,
} as const;

export type SiteTypography = {
  bodyFontId: string;
  displayFontId: string;
  bodySizePx: number;
  displaySizePx: number;
  textColor: string;
  bodyWeight: number;
  displayWeight: number;
};

export const FONT_BY_ID = new Map<string, FontOption>(FONT_OPTIONS.map((font) => [font.id, font]));

function validWeight(value: unknown): value is number {
  return typeof value === "number" && (FONT_WEIGHTS as readonly number[]).includes(value);
}

export function parseTypography(value: Prisma.JsonValue | null | undefined): SiteTypography {
  const record = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    bodyFontId: typeof record.bodyFontId === "string" && FONT_BY_ID.has(record.bodyFontId) ? record.bodyFontId : DEFAULT_TYPOGRAPHY.bodyFontId,
    displayFontId: typeof record.displayFontId === "string" && FONT_BY_ID.has(record.displayFontId) ? record.displayFontId : DEFAULT_TYPOGRAPHY.displayFontId,
    bodySizePx: typeof record.bodySizePx === "number" && record.bodySizePx >= 12 && record.bodySizePx <= 24 ? record.bodySizePx : DEFAULT_TYPOGRAPHY.bodySizePx,
    displaySizePx: typeof record.displaySizePx === "number" && record.displaySizePx >= 40 && record.displaySizePx <= 128 ? record.displaySizePx : DEFAULT_TYPOGRAPHY.displaySizePx,
    textColor: typeof record.textColor === "string" && /^#[0-9a-f]{6}$/i.test(record.textColor) ? record.textColor : DEFAULT_TYPOGRAPHY.textColor,
    bodyWeight: validWeight(record.bodyWeight) ? record.bodyWeight : DEFAULT_TYPOGRAPHY.bodyWeight,
    displayWeight: validWeight(record.displayWeight) ? record.displayWeight : DEFAULT_TYPOGRAPHY.displayWeight,
  };
}

export function buildGoogleFontsUrl(fontIds: readonly string[]) {
  const families = [...new Set(fontIds.map((id) => FONT_BY_ID.get(id)?.googleFamily).filter((value): value is string => Boolean(value)))];
  if (!families.length) return null;
  const query = families.map((family) => `family=${encodeURIComponent(family).replace(/%20/g, "+")}:wght@400;700`).join("&");
  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}
