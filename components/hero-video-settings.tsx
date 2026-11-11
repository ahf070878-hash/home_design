"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, LoaderCircle, RotateCcw, Save } from "lucide-react";
import { DEFAULT_HERO_MEDIA, type HeroMedia } from "@/lib/hero-settings";
import styles from "./admin-console.module.css";

type SaveState = "idle" | "loading" | "success" | "error";

export function HeroVideoSettings() {
  const [media, setMedia] = useState<HeroMedia>({ ...DEFAULT_HERO_MEDIA });
  const [token, setToken] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("Memuat pengaturan…");

  useEffect(() => {
    fetch("/api/admin/settings/hero-video")
      .then(async (response) => {
        if (!response.ok) throw new Error("Pengaturan tidak dapat dimuat.");
        return response.json() as Promise<HeroMedia>;
      })
      .then((value) => { setMedia(value); setMessage("Pengaturan aktif berhasil dimuat."); })
      .catch(() => { setSaveState("error"); setMessage("Pengaturan tidak dapat dimuat. Nilai bawaan ditampilkan."); });
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveState("loading");
    setMessage("Menyimpan perubahan…");
    const response = await fetch("/api/admin/settings/hero-video", {
      method: "PUT",
      headers: { "content-type": "application/json", ...(token ? { "x-settings-token": token } : {}) },
      body: JSON.stringify(media),
    });
    const payload = await response.json() as HeroMedia & { error?: string };
    if (!response.ok) {
      setSaveState("error");
      setMessage(payload.error ?? "Perubahan gagal disimpan.");
      return;
    }
    setMedia(payload);
    setSaveState("success");
    setMessage("Video hero sudah diperbarui.");
  }

  return <div className={styles.settingsGrid}>
    <form className={styles.formCard} onSubmit={save}>
      <header className={styles.cardHeader}><h2>Sumber media</h2><p>Gunakan path dari folder public atau URL HTTPS dari penyimpanan video Anda.</p></header>
      <div className={styles.field}><label htmlFor="hero-video-url">URL video</label><input id="hero-video-url" value={media.videoUrl} onChange={(event) => { setMedia((current) => ({ ...current, videoUrl: event.target.value })); setSaveState("idle"); }} placeholder="/assets/hero/home-design.mp4" required/></div>
      <div className={styles.field}><label htmlFor="hero-poster-url">URL gambar poster</label><input id="hero-poster-url" value={media.posterUrl} onChange={(event) => { setMedia((current) => ({ ...current, posterUrl: event.target.value })); setSaveState("idle"); }} placeholder="/assets/hero/home-design-poster.jpg" required/></div>
      <div className={styles.field}><label htmlFor="settings-token">Token admin produksi</label><input id="settings-token" type="password" value={token} onChange={(event) => setToken(event.target.value)} autoComplete="off" placeholder="Kosongkan untuk pengembangan lokal"/><small>Di produksi, isi sesuai <code>SETTINGS_ADMIN_TOKEN</code>.</small></div>
      <div className={styles.actions}><button className={styles.primaryButton} type="submit" disabled={saveState === "loading"} data-state={saveState}>{saveState === "loading" ? <LoaderCircle className={styles.spin} size={17}/> : saveState === "success" ? <Check size={17}/> : <Save size={17}/>} {saveState === "loading" ? "Menyimpan…" : saveState === "success" ? "Tersimpan" : "Simpan perubahan"}</button><button className={styles.secondaryButton} type="button" onClick={() => { setMedia({ ...DEFAULT_HERO_MEDIA }); setSaveState("idle"); setMessage("Nilai bawaan dipulihkan di formulir. Klik Simpan untuk menerapkan."); }}><RotateCcw size={17}/>Gunakan bawaan</button></div>
      <p className={`${styles.status} ${saveState === "error" ? styles.error : saveState === "success" ? styles.success : ""}`} role="status">{message}</p>
    </form>
    <section className={styles.previewCard}><p className={styles.previewLabel}>Pratinjau publik</p><div className={styles.videoFrame}><video key={`${media.videoUrl}-${media.posterUrl}`} controls muted loop playsInline poster={media.posterUrl}><source src={media.videoUrl} type="video/mp4"/></video></div><p>Pratinjau memakai nilai formulir. Halaman customer berubah setelah pengaturan disimpan.</p></section>
  </div>;
}
