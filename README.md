# HuniBangun.id / Tiket Bangun

Demo Phase 1 marketplace paket blueprint rumah. Aplikasi menerapkan alur konsumen 10 langkah: mulai dari ukuran lahan, pemilihan type dan varian, branded BOM, minat kontraktor opsional, akun + OTP, pembayaran paket desain, hingga penerbitan dokumen dan QR material sekali pakai.

## Aturan bisnis utama

- Langkah 1–7 dapat dipakai sebagai tamu dan tersimpan di `localStorage` melalui Zustand.
- Galeri selalu menampilkan seluruh 20 desain. Desain yang tidak muat diberi alasan selisih ukuran, opsi type terdekat, dan adaptasi custom.
- Checkout hanya memungut paket blueprint dan biaya adaptasi custom. Material dan kontraktor tidak pernah masuk total pembayaran.
- Pilihan material membentuk branded BOM, estimasi RAB regional, dan potensi diskon yang ditebus lewat QR di toko mitra.
- QR berlaku enam bulan, sekali tebus, dan memiliki satu kesempatan penerbitan ulang dalam simulasi kasir.

## Stack

- Next.js 16 App Router + React 19 + TypeScript strict
- Tailwind CSS 4 + semantic CSS tokens
- Zustand persist untuk sesi tamu
- Three.js / React Three Fiber untuk tahap pembangunan interaktif
- Lucide React dan `qrcode.react`
- Prisma ORM 7 + PostgreSQL untuk data transaksi dan redemption

## Menjalankan

```bash
npm install
npm run dev
npm run dev:admin
```

Buka aplikasi publik di `http://localhost:3015` dan konsol admin di `http://localhost:3016`. Port admin otomatis mengarah ke `/pengaturan`, memakai shell operasional tersendiri, dan menolak halaman customer. Jalankan kedua perintah pada terminal terpisah.

Verifikasi produksi:

```bash
npm run typecheck
npm run build
npm run build:admin
npm start
npm run start:admin
```

Route admin (`/pengaturan`, `/finance`, `/admin/*`, dan `/api/admin/*`) ditolak dari port publik. Pada produksi, isi `SETTINGS_ADMIN_TOKEN` dan masukkan token tersebut di konsol admin untuk operasi tulis.

## Database lokal

Salin `.env.example` menjadi `.env`, lalu pastikan PostgreSQL lokal menyediakan database `hunibangun`.

```bash
npm run prisma:validate
npm run prisma:generate
npm run db:push
npm run db:seed
```

Seed menghasilkan 20 desain, 10 produk material, satu user terverifikasi, dua contoh lahan, satu order terbit, satu toko mitra, dan voucher demo `TB-HB001-2026-7X9K`.

API utama:

- `GET /api/designs?width=8&length=15`
- `POST /api/customer-lands`
- `POST /api/unmatched-demands`
- `POST /api/qr/redeem`
- `GET /api/producer/metrics`
- `GET /api/hero-media`
- `GET /api/site-typography`
- `GET|PUT /api/admin/settings/hero-video` — hanya tersedia pada port admin
- `GET|PUT /api/admin/settings/typography` — 50 font, ukuran, warna, dan ketebalan

Penebusan QR memakai transaksi serializable dan conditional update untuk mencegah dua kasir menebus token yang sama. Notifikasi pengguna disimpan ke outbox `user_notifications` dalam transaksi yang sama.

## Rute

- `/` — landing dengan video hero dinamis, land-first filter, dan 20 desain.
- `/proses/2` sampai `/proses/10` — alur konsumen lengkap.
- `/kasir-mitra` — validasi/redeem token QR di toko mitra.
- `/dasbor-produsen` — analitik spesifikasi merek, redemption, nilai toko, dan demand gap.
- `/pengaturan` — konfigurasi video hero pada server admin port 3016.

## Struktur

```text
app/                    Next.js routes dan stylesheet global
components/             UI flow, gallery, Three.js stage, dan portal
lib/mock-data.ts        20 desain, IKK kota, material dual-visual, kontraktor
lib/store.ts            state reaktif persisten dan status QR/pembayaran
lib/prisma.ts           singleton Prisma Client + PostgreSQL adapter
prisma/schema.prisma    model transaksi dan redemption
prisma/seed.ts          data demo idempoten
public/assets/hero/     video hero web dan poster
public/assets/aistudio/ aset asli hasil ekspor
src/                    ekspor Vite asli, dipertahankan sebagai referensi
tokens.css              token warna, tipografi, spacing, motion
```

Semua data pembayaran, OTP, kontraktor, redemption, dan analitik pada repo ini adalah data demonstrasi.

## Google Cloud Run

Deployment produksi memakai dua service dari repository yang sama:

- `Dockerfile.customer` untuk service customer publik.
- `Dockerfile.admin` untuk service admin dengan autentikasi Cloud Run.

Kedua container mendengarkan `PORT` dari Cloud Run. Atur `DATABASE_URL` dan `SETTINGS_ADMIN_TOKEN` melalui Secret Manager, serta `GCS_MEDIA_BUCKET` ke bucket Cloud Storage yang dapat diakses service account Cloud Run. Tanpa `GCS_MEDIA_BUCKET`, Pustaka Aset memakai penyimpanan lokal hanya untuk pengembangan.
