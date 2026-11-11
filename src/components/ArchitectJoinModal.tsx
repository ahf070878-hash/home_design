import { useState } from 'react';
import { X, CheckCircle2, Shield, UploadCloud, Coins, Sparkles, Building2 } from 'lucide-react';

interface ArchitectJoinModalProps {
  onClose: () => void;
  defaultTab?: 'calculator' | 'form';
}

export default function ArchitectJoinModal({
  onClose,
  defaultTab = 'calculator',
}: ArchitectJoinModalProps) {
  const [activeTab, setActiveTab] = useState<'calculator' | 'form'>(defaultTab);

  // Royalty Calculator State
  const [designCount, setDesignCount] = useState<number>(4);
  const [downloadsPerMonth, setDownloadsPerMonth] = useState<number>(3);
  const avgPrice = 4500000;
  const royaltyRate = 0.8; // 80%

  const monthlyGross = designCount * downloadsPerMonth * avgPrice;
  const monthlyRoyalty = monthlyGross * royaltyRate;

  const formattedRoyalty = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(monthlyRoyalty);

  // Form Submission State
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studioName: '',
    straNo: '',
    principalName: '',
    email: '',
    phone: '',
    portfolioLink: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto cad-scrollbar relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#006948]/10 text-[#006948] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Portal Kemitraan & Skema Royalti Studio Arsitek
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                MONETISASI GAMBAR KERJA DED // 80% REVENUE SHARE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 px-5 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`pb-2.5 text-xs font-semibold border-b-2 mr-6 transition-colors cursor-pointer ${
              activeTab === 'calculator'
                ? 'border-[#006948] text-[#006948]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Simulasi Royalti Pasif (80%)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'form'
                ? 'border-[#006948] text-[#006948]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Daftar Studio Mitra (+ Upload)
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <div className="bg-[#f8fafc] border border-slate-200 rounded p-4 text-xs text-slate-600 leading-relaxed space-y-2">
                <p>
                  Banyak studio arsitek memiliki puluhan portofolio gambar kerja (DED) yang sudah
                  selesai digambar namun batal dibangun oleh klien lama.
                </p>
                <p>
                  Di <strong>HuniBangun.id</strong>, dokumen tersebut dapat diunggah sekali dan
                  menghasilkan penghasilan royalti berulang secara otomatis tanpa perlu melayani revisi
                  harian.
                </p>
              </div>

              {/* Interactive Sliders */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                    <span>Jumlah Paket DED yang Anda Unggah:</span>
                    <span className="font-mono text-[#006948] text-sm">{designCount} Desain</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={designCount}
                    onChange={(e) => setDesignCount(Number(e.target.value))}
                    className="w-full accent-[#006948] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>1 Desain</span>
                    <span>10 Desain</span>
                    <span>20 Desain</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                    <span>Estimasi Unduhan per Desain per Bulan:</span>
                    <span className="font-mono text-[#006948] text-sm">{downloadsPerMonth} Pembeli</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={downloadsPerMonth}
                    onChange={(e) => setDownloadsPerMonth(Number(e.target.value))}
                    className="w-full accent-[#006948] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>1 Pembeli</span>
                    <span>5 Pembeli</span>
                    <span>10 Pembeli</span>
                  </div>
                </div>
              </div>

              {/* Calculated Payout Highlight */}
              <div className="bg-emerald-50 border border-emerald-200 rounded p-5 text-center space-y-1.5">
                <div className="text-[11px] font-mono uppercase text-[#006948] font-bold tracking-wider">
                  ESTIMASI ROYALTI PASIF BERSIH ARSITEK:
                </div>
                <div className="text-3xl font-extrabold font-mono text-[#006948] tracking-tight">
                  {formattedRoyalty}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  per bulan (Pencairan Mingguan ke Rekening Studio)
                </div>
              </div>

              {/* Benefits list */}
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-[#006948] shrink-0 mt-0.5" />
                  <span>Hak cipta desain 100% tetap milik arsitek.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Coins className="w-4 h-4 text-[#006948] shrink-0 mt-0.5" />
                  <span>Sistem pembayaran otomatis & terproteksi.</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className="px-5 py-2.5 bg-[#006948] hover:bg-[#005137] text-white text-xs font-semibold rounded transition-colors cursor-pointer"
                >
                  Daftarkan Studio Sekarang ➔
                </button>
              </div>
            </div>
          )}

          {activeTab === 'form' && (
            <div>
              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#006948] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Pendaftaran Studio Diterima!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Tim kurasi teknis HuniBangun.id akan meninjau kelengkapan STRA dan berkas portofolio
                    Anda dalam 1x24 jam kerja.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-[#006948] text-white text-xs font-semibold rounded"
                  >
                    Selesai & Tutup
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-600 font-bold block mb-1">
                      NAMA STUDIO ARSITEK *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Atelier Kayu Manis Architecture"
                      value={formData.studioName}
                      onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded focus:border-[#006948] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-slate-600 font-bold block mb-1">
                        NO. STRA / IAI AKTIF *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 2023-11-IAI-4920"
                        value={formData.straNo}
                        onChange={(e) => setFormData({ ...formData, straNo: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded font-mono focus:border-[#006948] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase text-slate-600 font-bold block mb-1">
                        NAMA PRINSIPAL ARSITEK *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nama Arsitek Penanggung Jawab"
                        value={formData.principalName}
                        onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded focus:border-[#006948] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-slate-600 font-bold block mb-1">
                        EMAIL RESMI STUDIO *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="studio@arsitek.id"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded font-mono focus:border-[#006948] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase text-slate-600 font-bold block mb-1">
                        NO. WHATSAPP *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0812xxxxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded font-mono focus:border-[#006948] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-600 font-bold block mb-1">
                      TAUTAN PORTOFOLIO / SAMPLE FILE DED (GOOGLE DRIVE / DROPBOX) *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/drive/folders/..."
                      value={formData.portfolioLink}
                      onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded font-mono focus:border-[#006948] focus:outline-hidden"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Pastikan folder mencakup minimal 1 contoh denah AutoCAD (.dwg) dan PDF gambar kerja lengkap.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#006948] hover:bg-[#005137] text-white text-xs font-semibold rounded transition-colors cursor-pointer shadow-xs"
                    >
                      Kirim Berkas Pendaftaran Studio
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
