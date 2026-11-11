import { useState } from 'react';
import {
  CheckCircle2,
  Mail,
  ArrowRight,
  Download,
  CreditCard,
  Clock,
  Headphones,
  Check,
  Palette,
  FileText,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { BlueprintDesign, CustomMaterialSelections, MaterialCategory, MaterialOption } from '../types';
import BlueprintViewer from './BlueprintViewer';
import MaterialCustomizer from './MaterialCustomizer';

interface ProductSpotlightProps {
  blueprint: BlueprintDesign;
  customSelections: CustomMaterialSelections;
  onUpdateMaterialSelection: (cat: MaterialCategory, opt: MaterialOption) => void;
  onResetMaterialSelections: () => void;
  onBuyDirect: (blueprint: BlueprintDesign, packageType: 'standard' | 'consultation', email: string) => void;
  onOpenSampleModal: () => void;
}

export default function ProductSpotlight({
  blueprint,
  customSelections,
  onUpdateMaterialSelection,
  onResetMaterialSelections,
  onBuyDirect,
  onOpenSampleModal,
}: ProductSpotlightProps) {
  const [selectedPackage, setSelectedPackage] = useState<'standard' | 'consultation'>('standard');
  const [email, setEmail] = useState('budi.santoso@archmail.id');
  const [spotlightTab, setSpotlightTab] = useState<'customizer' | 'documents'>('customizer');

  const currentPrice = selectedPackage === 'standard' ? blueprint.priceDED : blueprint.priceWithConsultation;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(currentPrice);

  const formattedOriginalPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(blueprint.priceOriginal);

  // Calculate material upgrade delta
  const totalDelta = Object.values(customSelections).reduce((sum, item) => sum + item.priceDelta, 0);
  const baseCostNumeric = 650000000;
  const updatedPhysicalCost = baseCostNumeric + totalDelta;

  const formattedPhysicalCost = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(updatedPhysicalCost);

  const handleCheckoutClick = () => {
    onBuyDirect(blueprint, selectedPackage, email);
  };

  return (
    <section className="py-12 px-4 sm:px-6 bg-[#f7f9fb] border-t border-[#e2e8f0]">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-[#006948] text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded tracking-wider font-bold">
                BEST SELLER MINGGU INI
              </span>
              <span className="text-slate-400 font-mono text-xs">
                SKU: {blueprint.sku}
              </span>
              <span className="bg-emerald-100 text-[#006948] text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>KUSTOMISASI MATERIAL TERSEDIA</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sorotan Produk: {blueprint.title} #{blueprint.code}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Paket Gambar Kerja Lengkap Siap Eksekusi Lapangan & Verifikasi SIMBG PBG Nasional
            </p>
          </div>

          {/* Tab Switcher between Customizer & Document Spec */}
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg self-start md:self-auto shadow-xs">
            <button
              type="button"
              onClick={() => setSpotlightTab('customizer')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                spotlightTab === 'customizer'
                  ? 'bg-[#006948] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Studio Kustomisasi Material</span>
            </button>
            <button
              type="button"
              onClick={() => setSpotlightTab('documents')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                spotlightTab === 'documents'
                  ? 'bg-[#006948] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Berkas DED 42 Lembar</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Media Gallery + Customizer/Documents + Spec Boxes */}
          <div className="lg:col-span-8 space-y-6">
            {/* Interactive Blueprint & Elevation Viewer */}
            <BlueprintViewer
              blueprint={blueprint}
              onOpenSampleModal={onOpenSampleModal}
            />

            {/* TAB 1: Material Customizer */}
            {spotlightTab === 'customizer' && (
              <MaterialCustomizer
                blueprint={blueprint}
                customSelections={customSelections}
                onUpdateSelection={onUpdateMaterialSelection}
                onResetSelections={onResetMaterialSelections}
                onOpenCheckoutWithCustomSpecs={handleCheckoutClick}
              />
            )}

            {/* TAB 2: Isi Dokumen yang Diterima Pembeli */}
            {spotlightTab === 'documents' && (
              <div className="bg-white border border-[#e2e8f0] rounded p-5 shadow-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
                    <span>📋</span>
                    <span>Isi Dokumen yang Diterima Pembeli (DED Lengkap)</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 font-semibold tracking-wider">
                    TOTAL: {blueprint.totalSheets} LEMBAR A3
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {/* 1. Arsitektur */}
                  <div className="p-3 bg-[#f8fafc] border border-slate-100 rounded">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#006948] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          1. Gambar Arsitektur Lengkap (16 Lembar A3)
                        </h4>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">
                          Denah Lantai 1 & 2, Denah Pola Lantai, Tampak Depan/Belakang/Samping Kanan-Kiri,
                          Potongan Memanjang & Melintang, Rencana Plafon, serta Detail Pintu & Jendela Kusen Aluminium.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Struktur SNI */}
                  <div className="p-3 bg-[#f8fafc] border border-slate-100 rounded">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#006948] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          2. Gambar Struktur SNI Gempa Terverifikasi (14 Lembar A3)
                        </h4>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">
                          Rencana Pondasi Footplate (Cakar Ayam) & Sloof, Kolom Utama/Praktis, Balok Struktur,
                          Detail Pembesian Plat Lantai, Tangga Beton, dan Struktur Rangka Atap Baja Ringan bersertifikat SNI 1726:2019.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3. MEP */}
                  <div className="p-3 bg-[#f8fafc] border border-slate-100 rounded">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#006948] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          3. Gambar Mekanikal, Elektrikal, Plumbing / MEP (12 Lembar A3)
                        </h4>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">
                          Titik Lampu, Stop Kontak, Saklar & Jalur MCB Listrik, Jaringan Air Bersih, Air Kotor, Air Bekas,
                          Peresapan Air Hujan, dan Detail Bio-Septic Tank sesuai regulasi dinas lingkungan hidup.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4. CAD & Excel */}
                  <div className="p-3 bg-[#f8fafc] border border-slate-100 rounded">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#006948] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          4. Master File CAD Asli & Spreadsheet RAB Terbuka (Excel)
                        </h4>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">
                          AutoCAD (.DWG) editable tak terkunci, PDF High-Res siap cetak skala 1:100, dan File Excel
                          Bill of Quantities (BoQ) berisi formula volume material & estimasi upah tukang daerah.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4 Summary Spec Boxes (with Dynamic Physical Cost Calculation) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#f2f4f6] border border-[#e2e8f0] rounded p-3 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                  LUAS TANAH MIN.
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {blueprint.landArea} m²
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  ({blueprint.minLandWidth} x {blueprint.minLandLength} Meter)
                </div>
              </div>

              <div className="bg-[#f2f4f6] border border-[#e2e8f0] rounded p-3 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                  LUAS BANGUNAN
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {blueprint.buildingArea} m²
                </div>
                <div className="text-[11px] text-slate-500">
                  {blueprint.levels} Tingkat Efektif
                </div>
              </div>

              <div className="bg-[#f2f4f6] border border-[#e2e8f0] rounded p-3 text-center relative overflow-hidden">
                <div className="text-[10px] font-mono uppercase text-[#006948] font-bold">
                  EST. BIAYA FISIK (RAB)
                </div>
                <div className="text-base font-bold font-mono text-[#006948] mt-0.5 truncate">
                  Rp {(updatedPhysicalCost / 1000000).toFixed(0)} Jt
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  {totalDelta > 0 ? `+Rp ${(totalDelta / 1000000).toFixed(1)}Jt Kustom` : 'Std. Jabodetabek'}
                </div>
              </div>

              <div className="bg-[#f2f4f6] border border-[#e2e8f0] rounded p-3 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                  KESESUAIAN PBG
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {blueprint.simbgCompliance}%
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  SIMBG Teruji
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Pricing, Options, Checkout & Studio Badge */}
          <div className="lg:col-span-4 bg-white border border-[#e2e8f0] rounded-lg p-5 shadow-xs space-y-5 sticky top-20">
            {/* Badges */}
            <div className="flex items-center gap-2">
              <span className="bg-[#006948] text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold">
                LISENSI 1 UNIT BANGUNAN
              </span>
              <span className="bg-[#fef3c7] text-[#92400e] text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold">
                GARANSI SIMBG PBG
              </span>
            </div>

            {/* Price display */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                  {formattedPrice}
                </span>
                <span className="text-xs line-through text-slate-400 font-mono">
                  {formattedOriginalPrice}
                </span>
              </div>
              <p className="text-[11px] text-[#006948] font-medium mt-1">
                Hemat 70% dibanding biaya desain custom arsitek konvensional.
              </p>
            </div>

            {/* Customer Customized Materials Live Card */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded p-3 space-y-2">
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-200">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#006948]" />
                  <span>Komponen Material Terpilih</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSpotlightTab('customizer')}
                  className="text-[10px] text-[#006948] font-bold hover:underline cursor-pointer"
                >
                  Ubah
                </button>
              </div>

              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Lantai:</span>
                  <strong className="text-slate-800 truncate max-w-[170px]">
                    {customSelections.lantai.brand}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Warna Cat:</span>
                  <strong className="text-slate-800 truncate max-w-[170px]">
                    {customSelections.dinding.brand} ({customSelections.dinding.colorName?.split(' ')[0]})
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Kusen:</span>
                  <strong className="text-slate-800 truncate max-w-[170px]">
                    {customSelections.pintuJendela.brand}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Plafon:</span>
                  <strong className="text-slate-800 truncate max-w-[170px]">
                    {customSelections.plafon.brand}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sanitari:</span>
                  <strong className="text-slate-800 truncate max-w-[170px]">
                    {customSelections.kloset.brand} & {customSelections.wastafel.brand}
                  </strong>
                </div>
              </div>

              {totalDelta !== 0 && (
                <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">Penyesuaian Fisik:</span>
                  <span className="font-mono font-bold text-[#006948]">
                    {totalDelta > 0 ? '+' : ''}Rp {(totalDelta / 1000000).toFixed(1)} Jt
                  </span>
                </div>
              )}
            </div>

            {/* Package Selector */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
                PILIH PAKET DOKUMEN:
              </div>

              {/* Option 1: Standard DED */}
              <label
                onClick={() => setSelectedPackage('standard')}
                className={`flex items-start gap-3 p-3 rounded border transition-all cursor-pointer ${
                  selectedPackage === 'standard'
                    ? 'border-[#006948] bg-emerald-50/40 ring-1 ring-[#006948]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="packageSelect"
                  checked={selectedPackage === 'standard'}
                  onChange={() => setSelectedPackage('standard')}
                  className="mt-0.5 text-[#006948] focus:ring-[#006948]"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Paket Standar DED</span>
                    <span className="font-mono text-slate-800">
                      Rp {(blueprint.priceDED / 1000000).toFixed(1).replace('.', ',')}00.000
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1 leading-snug">
                    CAD DWG + PDF A3 + BoQ Excel RAB (Akses Download Langsung).
                  </p>
                </div>
              </label>

              {/* Option 2: DED + Consultation */}
              <label
                onClick={() => setSelectedPackage('consultation')}
                className={`flex items-start gap-3 p-3 rounded border transition-all cursor-pointer ${
                  selectedPackage === 'consultation'
                    ? 'border-[#006948] bg-emerald-50/40 ring-1 ring-[#006948]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="packageSelect"
                  checked={selectedPackage === 'consultation'}
                  onChange={() => setSelectedPackage('consultation')}
                  className="mt-0.5 text-[#006948] focus:ring-[#006948]"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Paket DED + Konsultasi</span>
                    <span className="font-mono text-slate-800">
                      Rp {(blueprint.priceWithConsultation / 1000000).toFixed(1).replace('.', ',')}00.000
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1 leading-snug">
                    Semua isi DED + 1x Sesi Video Call 60 menit bersama Studio Arsitek untuk revisi ringan / advis tapak.
                  </p>
                </div>
              </label>
            </div>

            {/* Email delivery input */}
            <div className="space-y-1.5 border-t border-slate-100 pt-3">
              <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold tracking-wider block">
                ALAMAT EMAIL PENGIRIMAN BERKAS:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:outline-hidden focus:border-[#006948] focus:ring-1 focus:ring-[#006948] font-mono text-slate-800"
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                Tautan unduhan permanen file DWG & invoice otomatis dikirimkan ke email ini.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="w-full py-3 bg-[#006948] hover:bg-[#005137] active:bg-[#003d29] text-white text-sm font-semibold rounded flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <span>🛒 Beli & Unduh Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenSampleModal}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Unduh Sample Denah Watermark (PDF Gratis)</span>
              </button>
            </div>

            {/* Trust checklist */}
            <div className="border-t border-slate-100 pt-3 space-y-2 text-[11px] text-slate-600">
              <div className="flex items-start gap-2">
                <CreditCard className="w-3.5 h-3.5 text-[#006948] shrink-0 mt-0.5" />
                <span>Metode: QRIS Instan, Transfer BCA / Mandiri / BRI, Kartu Kredit.</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#006948] shrink-0 mt-0.5" />
                <span>Pengiriman Instan: Server Cloud CDN 30 Detik setelah verifikasi.</span>
              </div>
              <div className="flex items-start gap-2">
                <Headphones className="w-3.5 h-3.5 text-[#006948] shrink-0 mt-0.5" />
                <span>Dukungan Teknis: Tim Arsitek HuniBangun.id siap mendampingi kontraktor.</span>
              </div>
            </div>

            {/* Studio Badge Box */}
            <div className="border border-slate-200 rounded p-3 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded bg-[#1e293b] text-white font-mono font-bold text-xs flex items-center justify-center">
                  {blueprint.architect.avatarText}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 leading-tight">
                    {blueprint.architect.name}
                  </h5>
                  <div className="text-[10px] text-slate-500 font-mono">
                    STRA No: {blueprint.architect.straNo}
                  </div>
                </div>
              </div>
              <span className="bg-[#006948] text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold">
                STUDIO RESMI
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
