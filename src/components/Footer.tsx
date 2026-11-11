interface FooterProps {
  onOpenArchitectModal: () => void;
  onOpenComplianceInfo: () => void;
  onOpenCodeExport: () => void;
}

export default function Footer({
  onOpenArchitectModal,
  onOpenComplianceInfo,
  onOpenCodeExport,
}: FooterProps) {
  return (
    <footer className="border-t border-[#e2e8f0] bg-white pt-12 pb-8 px-4 sm:px-6 text-xs text-slate-600">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#006948] flex items-center justify-center text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-3.5 h-3.5"
                >
                  <path d="M3 10.5 12 3l9 7.5v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
                </svg>
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                Huni<span className="text-[#006948]">Bangun</span>.id
              </span>
            </div>

            <p className="text-slate-500 leading-relaxed text-[11px]">
              Platform digital kurasi dokumen arsitektur siap bangun, verifikasi PBG, dan kolaborasi
              profesional terintegrasi.
            </p>

            <div>
              <span className="inline-block bg-[#f2f4f6] border border-slate-200 text-slate-700 text-[10px] font-mono uppercase px-2 py-0.5 rounded tracking-wider font-semibold">
                STANDAR DED & RAB
              </span>
            </div>
          </div>

          {/* Col 2: Untuk Arsitek */}
          <div>
            <h5 className="font-bold text-slate-900 font-mono text-[11px] uppercase tracking-wider mb-3">
              UNTUK ARSITEK
            </h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={onOpenArchitectModal}
                  className="hover:text-[#006948] transition-colors cursor-pointer text-left"
                >
                  Gabung Studio Mitra
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenArchitectModal}
                  className="hover:text-[#006948] transition-colors cursor-pointer text-left"
                >
                  Pedoman Royalti Desain
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenComplianceInfo}
                  className="hover:text-[#006948] transition-colors cursor-pointer text-left"
                >
                  Standarisasi Format CAD & BIM
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Kepatuhan & Legal */}
          <div>
            <h5 className="font-bold text-slate-900 font-mono text-[11px] uppercase tracking-wider mb-3">
              KEPATUHAN & LEGAL
            </h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={onOpenComplianceInfo}
                  className="hover:text-[#006948] transition-colors cursor-pointer text-left"
                >
                  Kepatuhan PBG (Persetujuan Bangunan Gedung)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenComplianceInfo}
                  className="hover:text-[#006948] transition-colors cursor-pointer text-left"
                >
                  Lisensi Hak Cipta Gambar Kerja
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenComplianceInfo}
                  className="hover:text-[#006948] transition-colors cursor-pointer text-left"
                >
                  Syarat & Ketentuan Transaksi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Infrastruktur Dokumen */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 font-mono text-[11px] uppercase tracking-wider mb-3">
              INFRASTRUKTUR DOKUMEN
            </h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Setiap paket mencakup Gambar DED, Rencana Anggaran Biaya (RAB), dan advis konstruksi bersertifikasi.
            </p>

            <div className="space-y-1 font-mono text-[10px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>VERIFIKASI SKK:</span>
                <span className="font-bold text-[#006948]">AKTIF</span>
              </div>
              <div className="flex items-center justify-between">
                <span>FORMAT:</span>
                <span className="font-bold text-slate-800">DWG, PDF, XLSX</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenCodeExport}
                className="w-full py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-[#006948] font-bold text-[11px] rounded border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>📦 Export Source Code & Data (.ZIP)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © 2025 HuniBangun.id · Ekosistem Rancang Bangun & E-Commerce Cetak Biru Indonesia.
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006948]" />
            <span>Sistem Terenkripsi</span>
            <span className="text-slate-300">·</span>
            <strong className="text-slate-700">IDR MILESTONE PROTECTED</strong>
          </div>
        </div>
      </div>
    </footer>
  );
}
