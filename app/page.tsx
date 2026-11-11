import { DesignGallery } from "@/components/design-gallery";
import { HeroVideo } from "@/components/hero-video";
import { FlowStrip, Footer, SiteNav } from "@/components/site-shell";

export default function HomePage() {
  return <><SiteNav/><main>
    <HeroVideo/>
    <FlowStrip active={1}/>
    <section className="shell section" id="katalog"><div className="section-head"><h2>Mulai dari batas lahan, bukan selera gambar.</h2><p>Desain yang tidak muat tidak disembunyikan. Anda akan melihat selisih ukurannya dan dapat memilih type terdekat atau adaptasi custom.</p></div><DesignGallery/></section>
    <section className="shell section"><div className="section-head"><h2>Sepuluh keputusan, satu jejak yang utuh.</h2><p>Pilihan tamu tersimpan di perangkat sampai Anda masuk pada langkah 8.</p></div><ol className="dashboard-grid"><li className="panel"><strong className="mono">01—03</strong><h3>Lahan dan type</h3><p>Masukkan ukuran, lihat kecocokan, dan bandingkan sampai tiga desain.</p></li><li className="panel"><strong className="mono">04—07</strong><h3>Varian dan RAB</h3><p>Tinjau fasad, denah, BOM bermerek, serta minat kontraktor tanpa mengubah total checkout.</p></li><li className="panel"><strong className="mono">08—10</strong><h3>Akun, bayar, terbit</h3><p>Verifikasi OTP, bayar paket desain, lalu unduh dokumen dan QR material.</p></li></ol></section>
  </main><Footer/></>;
}
