import { Shield, Coins, ArrowRight, HelpCircle } from 'lucide-react';

interface PartnerBannerProps {
  onOpenJoinModal: () => void;
  onOpenRoyaltyCalculator: () => void;
}

export default function PartnerBanner({
  onOpenJoinModal,
  onOpenRoyaltyCalculator,
}: PartnerBannerProps) {
  return (
    <section className="py-12 px-4 sm:px-6 bg-[#f7f9fb]">
      <div className="max-w-[1440px] mx-auto">
        <div className="relative bg-[#eceef0] border border-[#d8dadc] rounded-xl p-6 sm:p-10 overflow-hidden shadow-xs">
          {/* Subtle CAD Drafting Watermark Circle on the right */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[420px] h-[420px] rounded-full border border-slate-300/60 pointer-events-none flex items-center justify-center">
            <div className="w-[300px] h-[300px] rounded-full border border-slate-300/60 flex items-center justify-center">
              <div className="w-[180px] h-[180px] rounded-full border border-slate-300/40" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] bg-slate-300/60" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-[1px] bg-slate-300/60" />
            </div>
          </div>

          <div className="relative z-10 max-w-3xl">
            {/* Kicker */}
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#006948] font-bold mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006948]" />
              <span>PORTAL KEMITRAAN ARSITEK INDONESIA</span>
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Punya Portofolio Desain yang Tidak Terbangun?
            </h3>

            {/* Description */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
              Daftarkan studio Anda sebagai arsitek mitra di HuniBangun.id. Monetisasi gambar kerja Anda
              dan nikmati <strong className="text-slate-900">Royalti Pasif 80%</strong> dari setiap cetak biru
              yang terjual ke seluruh pelosok nusantara tanpa perlu repot mengurus administrasi pembayaran.
            </p>

            {/* Perks */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-700 font-medium mb-6">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#006948]" />
                <span>Hak Cipta Tetap Milik Anda</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#006948]" />
                <span>Pencairan Dana Mingguan Otomatis</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenJoinModal}
                className="bg-[#006948] hover:bg-[#005137] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <span>Daftar Jadi Arsitek Mitra</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenRoyaltyCalculator}
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded transition-colors cursor-pointer"
              >
                Pelajari Skema Royalti
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
