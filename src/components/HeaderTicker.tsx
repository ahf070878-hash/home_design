import { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';

export default function HeaderTicker() {
  const [showComplianceModal, setShowComplianceModal] = useState(false);

  return (
    <>
      <div className="bg-[#f2f4f6] border-b border-[#e2e8f0] text-[#3d4a42] text-[11px] font-mono tracking-wider py-1.5 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006948]" />
              SYS_CAD_VER: <strong className="text-slate-800">2025.4.1</strong>
            </span>
            <span className="hidden sm:inline text-slate-300">/</span>
            <span>
              PROYEK_REF: <strong className="text-slate-800">ID-AR-MKTP</strong>
            </span>
            <span className="hidden sm:inline text-slate-300">/</span>
            <span>
              STANDARD: <strong className="text-slate-800">SNI 1726:2019 / PBG-COMPLIANT</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-right">
            <span className="hidden md:inline">
              KURS: <strong className="text-slate-800">IDR (MILESTONE VERIFIED)</strong>
            </span>
            <button
              onClick={() => setShowComplianceModal(true)}
              className="flex items-center gap-1 text-[#006948] hover:text-[#005137] font-semibold transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% GARANSI LEGAL DED</span>
              <Info className="w-3 h-3 ml-0.5 opacity-70" />
            </button>
          </div>
        </div>
      </div>

      {/* Compliance & SNI Guarantee Modal */}
      {showComplianceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 border border-slate-200 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowComplianceModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#006948]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Garansi Legal & Standar SNI 1726:2019</h3>
                <p className="text-xs text-slate-500 font-mono">STANDAR REGULASI DOKUMEN ARSITEKTUR NASIONAL</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 mt-4">
              <p>
                Setiap dokumen Gambar Kerja Lengkap (DED) di HuniBangun.id telah melalui uji kelayakan
                struktur oleh tim teknis dan berlisensi Ikatan Arsitek Indonesia (IAI):
              </p>
              <ul className="space-y-2 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#006948] font-bold">✓</span>
                  <span><strong>SNI 1726:2019:</strong> Perhitungan ketahanan gempa untuk zonasi seismik wilayah Indonesia.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#006948] font-bold">✓</span>
                  <span><strong>Lolos Verifikasi SIMBG:</strong> Format siap diunggah ke Sistem Informasi Manajemen Bangunan Gedung untuk penerbitan PBG (pengganti IMB).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#006948] font-bold">✓</span>
                  <span><strong>Garansi Uang Kembali 100%:</strong> Apabila berkas DED ditolak oleh dinas perizinan karena kesalahan perhitungan struktural dasar arsitek.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowComplianceModal(false)}
                className="bg-[#006948] hover:bg-[#005137] text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
              >
                Pahami & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
