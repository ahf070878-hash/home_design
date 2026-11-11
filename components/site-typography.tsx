"use client";

import { useEffect } from "react";
import { buildGoogleFontsUrl, FONT_BY_ID, parseTypography, type SiteTypography } from "@/lib/site-typography";

function applyTypography(value: SiteTypography) {
  const root = document.documentElement;
  const bodyFont = FONT_BY_ID.get(value.bodyFontId);
  const displayFont = FONT_BY_ID.get(value.displayFontId);
  if (!bodyFont || !displayFont) return;

  const googleFontsUrl = buildGoogleFontsUrl([value.bodyFontId, value.displayFontId]);
  let fontLink = document.querySelector<HTMLLinkElement>("#site-typography-fonts");
  if (googleFontsUrl) {
    if (!fontLink) {
      fontLink = document.createElement("link");
      fontLink.id = "site-typography-fonts";
      fontLink.rel = "stylesheet";
      document.head.appendChild(fontLink);
    }
    fontLink.href = googleFontsUrl;
  } else {
    fontLink?.remove();
  }

  root.style.setProperty("--font-body", bodyFont.family);
  root.style.setProperty("--font-display", displayFont.family);
  root.style.setProperty("--site-body-size", `${value.bodySizePx}px`);
  root.style.setProperty("--site-display-size", `${value.displaySizePx}px`);
  root.style.setProperty("--site-text-color", value.textColor);
  root.style.setProperty("--site-body-weight", String(value.bodyWeight));
  root.style.setProperty("--site-display-weight", String(value.displayWeight));
}

export function SiteTypographyLoader({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    fetch("/api/site-typography", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((value: SiteTypography) => applyTypography(parseTypography(value)))
      .catch(() => undefined);
    return () => controller.abort();
  }, [enabled]);
  return null;
}
