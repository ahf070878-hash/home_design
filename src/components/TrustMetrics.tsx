import { FileCheck, Building2, Download, ShieldCheck } from 'lucide-react';

export default function TrustMetrics() {
  const metrics = [
    {
      icon: FileCheck,
      value: '1.240+',
      label: 'Dokumen DED Terverifikasi',
      hint: 'Arsitektur, Struktur, MEP lengkap',
    },
    {
      icon: Building2,
      value: '180+',
      label: 'Studio Arsitek Berlisensi IAI',
      hint: 'Kurasi ketat & ber-STRA aktif',
    },
    {
      icon: Download,
      value: '30 Detik',
      label: 'Akses Instan File DWG & BoQ',
      hint: 'Unduh langsung via CDN terenkripsi',
    },
    {
      icon: ShieldCheck,
      value: '100% PBG',
      label: 'Garansi Lolos SIMBG Nasional',
      hint: 'Format standar izin bangunan gedung',
    },
  ];

  return (
    <div className="border-y border-[#e2e8f0] bg-white py-6 px-4 sm:px-6">
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3.5 p-2 rounded hover:bg-slate-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded border border-[#006948]/20 bg-[#006948]/5 flex items-center justify-center text-[#006948] shrink-0 group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight leading-none">
                  {item.value}
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1 leading-snug">
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
