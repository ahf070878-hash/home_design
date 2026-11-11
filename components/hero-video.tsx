"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, QrCode } from "lucide-react";
import { DEFAULT_HERO_MEDIA, type HeroMedia } from "@/lib/hero-settings";

export function HeroVideo() {
  const [media, setMedia] = useState<HeroMedia>({ ...DEFAULT_HERO_MEDIA });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/hero-media", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((payload: HeroMedia) => setMedia(payload))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  return <section className="video-hero" aria-labelledby="hero-title">
    <link rel="preload" as="image" href={media.posterUrl} fetchPriority="high"/>
    <video key={media.videoUrl} className="video-hero-media" autoPlay muted loop playsInline preload="metadata" poster={media.posterUrl} aria-hidden="true">
      <source src={media.videoUrl} type="video/mp4"/>
    </video>
    <div className="video-hero-shade"/>
    <div className="shell video-hero-content">
      <p className="video-hero-eyebrow">Blueprint marketplace · bukan toko material</p>
      <h1 id="hero-title">Ukur lahan. Pilih desain. Bangun dengan pasti.</h1>
      <p className="video-hero-lede">Beli paket gambar kerja siap lapangan, susun RAB bermerek, lalu tebus potongan material melalui satu QR di toko mitra.</p>
      <div className="hero-actions"><Link className="btn btn-primary" href="/proses/2">Isi ukuran lahan <ArrowRight size={18}/></Link><Link className="btn btn-on-media" href="#katalog">Lihat 20 desain</Link></div>
      <div className="card-actions video-hero-badges"><span className="badge"><BadgeCheck size={14}/>Langkah 1–7 tanpa login</span><span className="badge"><QrCode size={14}/>Material tidak dibayar di sini</span></div>
    </div>
  </section>;
}
