"use client";

import type { CSSProperties, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Check, LoaderCircle, RotateCcw, Save } from "lucide-react";
import { buildGoogleFontsUrl, DEFAULT_TYPOGRAPHY, FONT_BY_ID, FONT_OPTIONS, FONT_WEIGHTS, type SiteTypography } from "@/lib/site-typography";
import styles from "./admin-console.module.css";

type SaveState = "idle" | "loading" | "success" | "error";

export function TypographySettings() {
  const [typography, setTypography] = useState<SiteTypography>({ ...DEFAULT_TYPOGRAPHY });
  const [token, setToken] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("Memuat pengaturan…");

  useEffect(() => {
    fetch("/api/admin/settings/typography")
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<SiteTypography>;
      })
      .then((value) => { setTypography(value); setMessage("Pengaturan tipografi aktif berhasil dimuat."); })
      .catch(() => { setSaveState("error"); setMessage("Pengaturan gagal dimuat. Nilai bawaan ditampilkan."); });
  }, []);

  useEffect(() => {
    const href = buildGoogleFontsUrl([typography.bodyFontId, typography.displayFontId]);
    let link = document.querySelector<HTMLLinkElement>("#admin-typography-preview-fonts");
    if (href) {
      if (!link) {
        link = document.createElement("link");
        link.id = "admin-typography-preview-fonts";
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      link.href = href;
    } else {
      link?.remove();
    }
  }, [typography.bodyFontId, typography.displayFontId]);

  const previewStyle = useMemo(() => ({
    "--preview-body-font": FONT_BY_ID.get(typography.bodyFontId)?.family,
    "--preview-display-font": FONT_BY_ID.get(typography.displayFontId)?.family,
    "--preview-body-size": `${typography.bodySizePx}px`,
    "--preview-display-size": `${Math.min(typography.displaySizePx, 72)}px`,
    "--preview-text-color": typography.textColor,
    "--preview-body-weight": typography.bodyWeight,
    "--preview-display-weight": typography.displayWeight,
  }) as CSSProperties, [typography]);

  function update<K extends keyof SiteTypography>(key: K, value: SiteTypography[K]) {
    setTypography((current) => ({ ...current, [key]: value }));
    setSaveState("idle");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveState("loading");
    setMessage("Menyimpan perubahan…");
    const response = await fetch("/api/admin/settings/typography", {
      method: "PUT",
      headers: { "content-type": "application/json", ...(token ? { "x-settings-token": token } : {}) },
      body: JSON.stringify(typography),
    });
    const payload = await response.json() as SiteTypography & { error?: string };
    if (!response.ok) {
      setSaveState("error");
      setMessage(payload.error ?? "Perubahan gagal disimpan.");
      return;
    }
    setTypography(payload);
    setSaveState("success");
    setMessage("Tipografi customer sudah diperbarui.");
  }

  return <div className={styles.settingsGrid}>
    <form className={styles.formCard} onSubmit={save}>
      <header className={styles.cardHeader}><h2>Penempatan font customer</h2><p>Pilih font berdasarkan area pemakaiannya di situs customer port 3015. Tersedia {FONT_OPTIONS.length} keluarga font.</p></header>
      <div className={styles.controlGrid}>
        <div className={styles.field}><label htmlFor="body-font">Font teks umum customer</label><select id="body-font" aria-describedby="body-font-placement" value={typography.bodyFontId} onChange={(event) => update("bodyFontId", event.target.value)}>{FONT_OPTIONS.map((font) => <option key={font.id} value={font.id}>{font.label} · {font.category}</option>)}</select><small id="body-font-placement">Dipakai untuk paragraf, navigasi, tombol, formulir, dan konten umum.</small></div>
        <div className={styles.field}><label htmlFor="display-font">Font judul &amp; hero customer</label><select id="display-font" aria-describedby="display-font-placement" value={typography.displayFontId} onChange={(event) => update("displayFontId", event.target.value)}>{FONT_OPTIONS.map((font) => <option key={font.id} value={font.id}>{font.label} · {font.category}</option>)}</select><small id="display-font-placement">Dipakai untuk judul hero, H1–H3, nama brand, dan angka utama.</small></div>
        <div className={styles.field}><label htmlFor="body-weight">Ketebalan teks umum</label><select id="body-weight" value={typography.bodyWeight} onChange={(event) => update("bodyWeight", Number(event.target.value))}>{FONT_WEIGHTS.map((weight) => <option key={weight} value={weight}>{weight} · {weight === 400 ? "Normal" : weight === 500 ? "Medium" : weight === 600 ? "Semibold" : "Bold"}</option>)}</select></div>
        <div className={styles.field}><label htmlFor="display-weight">Ketebalan judul &amp; hero</label><select id="display-weight" value={typography.displayWeight} onChange={(event) => update("displayWeight", Number(event.target.value))}>{FONT_WEIGHTS.map((weight) => <option key={weight} value={weight}>{weight} · {weight === 400 ? "Normal" : weight === 500 ? "Medium" : weight === 600 ? "Semibold" : "Bold"}</option>)}</select></div>
      </div>
      <div className={styles.rangeField}><label htmlFor="body-size"><span>Ukuran dasar teks umum customer</span><output>{typography.bodySizePx}px</output></label><input id="body-size" type="range" min="12" max="24" step="1" value={typography.bodySizePx} onChange={(event) => update("bodySizePx", Number(event.target.value))}/></div>
      <div className={styles.rangeField}><label htmlFor="display-size"><span>Ukuran maksimum judul hero</span><output>{typography.displaySizePx}px</output></label><input id="display-size" type="range" min="40" max="128" step="2" value={typography.displaySizePx} onChange={(event) => update("displaySizePx", Number(event.target.value))}/></div>
      <div className={styles.colorField}><label htmlFor="text-color">Warna teks utama customer</label><div><input id="text-color" type="color" value={typography.textColor} onChange={(event) => update("textColor", event.target.value)}/><code>{typography.textColor.toUpperCase()}</code></div></div>
      <div className={styles.field}><label htmlFor="typography-token">Token admin produksi</label><input id="typography-token" type="password" value={token} onChange={(event) => setToken(event.target.value)} autoComplete="off" placeholder="Kosongkan untuk pengembangan lokal"/><small>Di produksi, isi sesuai <code>SETTINGS_ADMIN_TOKEN</code>.</small></div>
      <div className={styles.actions}><button className={styles.primaryButton} type="submit" disabled={saveState === "loading"}>{saveState === "loading" ? <LoaderCircle className={styles.spin} size={17}/> : saveState === "success" ? <Check size={17}/> : <Save size={17}/>} {saveState === "loading" ? "Menyimpan…" : saveState === "success" ? "Tersimpan" : "Simpan tipografi"}</button><button className={styles.secondaryButton} type="button" onClick={() => { setTypography({ ...DEFAULT_TYPOGRAPHY }); setSaveState("idle"); setMessage("Nilai bawaan dipulihkan di formulir. Klik Simpan untuk menerapkan."); }}><RotateCcw size={17}/>Gunakan bawaan</button></div>
      <p className={`${styles.status} ${saveState === "error" ? styles.error : saveState === "success" ? styles.success : ""}`} role="status">{message}</p>
    </form>
    <section className={`${styles.previewCard} ${styles.typePreview}`} style={previewStyle}><p className={styles.previewLabel}>Pratinjau · Judul &amp; hero customer</p><h3>Rumah yang siap dibangun.</h3><p><strong>Teks umum customer:</strong> periksa keterbacaan paragraf, navigasi, tombol, dan formulir sebelum menyimpan.</p><span>Identitas &amp; angka utama · HuniBangun.id · Type 72</span></section>
  </div>;
}
