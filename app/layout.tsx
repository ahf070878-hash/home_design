import type { Metadata } from "next";
import { SiteTypographyLoader } from "@/components/site-typography";
import "./globals.css";

export const metadata: Metadata = {
  title: "HuniBangun.id — Tiket Bangun",
  description: "Pilih paket gambar kerja, susun BOM bermerek, dan tebus manfaat material di toko mitra.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><SiteTypographyLoader enabled={process.env.APP_SURFACE !== "admin"}/>{children}</body></html>;
}
