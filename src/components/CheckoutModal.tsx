import { useState } from 'react';
import {
  X,
  CheckCircle2,
  Download,
  Copy,
  Check,
  QrCode,
  CreditCard,
  Building,
  ShieldCheck,
  FileArchive,
  ArrowRight,
} from 'lucide-react';
import { BlueprintDesign, CustomMaterialSelections } from '../types';

interface CheckoutModalProps {
  blueprint: BlueprintDesign;
  packageType: 'standard' | 'consultation';
  email: string;
  customSelections?: CustomMaterialSelections;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutModal({
  blueprint,
  packageType,
  email,
  customSelections,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca' | 'mandiri' | 'cc'>('qris');
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');

  const price = packageType === 'standard' ? blueprint.priceDED : blueprint.priceWithConsultation;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);

  const vaNumber = '8274081299837102';

  const handleCopyVA = () => {
    navigator.clipboard?.writeText(vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      onSuccess();
    }, 1800);
  };

  const handleDownloadFiles = () => {
    const customSummary = customSelections
      ? `\nLAMPIRAN SPESIFIKASI MATERIAL KUSTOMISASI KLIEN (RKS BoQ):\n` +
        `- Jenis Lantai: ${customSelections.lantai.brand} (${customSelections.lantai.name}) - ${customSelections.lantai.colorName}\n` +
        `- Kusen Pintu/Jendela: ${customSelections.pintuJendela.brand} (${customSelections.pintuJendela.name})\n` +
        `- Cat & Warna Dinding: ${customSelections.dinding.brand} (${customSelections.dinding.colorName})\n` +
        `- Plafon: ${customSelections.plafon.brand} (${customSelections.plafon.name}) - ${customSelections.plafon.colorName}\n` +
        `- Kloset: ${customSelections.kloset.brand} (${customSelections.kloset.name})\n` +
        `- Wastafel & Sanitari: ${customSelections.wastafel.brand} (${customSelections.wastafel.name})\n`
      : '';

    // Generate a download trigger for customer satisfaction
    const dummyBlob = new Blob(
      [
        `HUNIBANGUN.ID — DOKUMEN CETAK BIRU RESMI DED\n\n` +
          `Kode Desain: ${blueprint.code}\n` +
          `Judul: ${blueprint.title}\n` +
          `Arsitek: ${blueprint.architect.name} (${blueprint.architect.straNo})\n` +
          `Paket: ${packageType === 'standard' ? 'Paket Standar DED' : 'Paket DED + Konsultasi'}\n` +
          `Total Lembar Kerja: ${blueprint.totalSheets} Lembar A3\n` +
          `Kepatuhan SIMBG: 100% Lolos Uji PBG Nasional\n` +
          customSummary +
          `\nFile Termasuk:\n` +
          `1. Master AutoCAD .DWG (Editable 1:100)\n` +
          `2. Cetak Siap Bangun PDF A3 High-Res (42 Lembar)\n` +
          `3. Bill of Quantities (BoQ) RAB Excel Editable Terbuka (Termasuk RKS Bahan Terpilih)\n\n` +
          `Lisensi ini resmi diterbitkan untuk email: ${email}\n` +
          `Tanggal Verifikasi: ${new Date().toLocaleDateString('id-ID')}`,
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(dummyBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${blueprint.code}_${blueprint.title.replace(/\s+/g, '_')}_DED_Paket_Lengkap.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto cad-scrollbar relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <div className="text-[10px] font-mono text-[#006948] uppercase tracking-wider font-bold">
              ESCROW & CHECKOUT RESMI
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {step === 'success' ? 'Pembayaran Terverifikasi & Akses Berkas Aktif' : 'Pembelian Lisensi DED Siap Bangun'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on step */}
        {step === 'payment' && (
          <div className="p-5 space-y-5">
            {/* Order summary card */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{blueprint.title}</span>
                <span className="font-mono text-slate-500 font-bold">#{blueprint.code}</span>
              </div>
              <div className="text-xs text-slate-600 flex items-center justify-between">
                <span>Paket Dokumen:</span>
                <span className="font-semibold text-slate-800">
                  {packageType === 'standard' ? 'Paket Standar DED' : 'Paket DED + Sesi Konsultasi'}
                </span>
              </div>
              <div className="text-xs text-slate-600 flex items-center justify-between">
                <span>Email Penerima:</span>
                <span className="font-mono text-slate-800">{email}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-600 font-semibold">Total Tagihan:</span>
                <span className="text-lg font-bold font-mono text-[#006948]">{formattedPrice}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase text-slate-500 font-semibold tracking-wider block">
                PILIH METODE PEMBAYARAN INSTAN:
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-2.5 rounded border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'qris'
                      ? 'border-[#006948] bg-emerald-50 text-[#006948] font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span className="text-xs">QRIS Instan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bca')}
                  className={`p-2.5 rounded border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'bca'
                      ? 'border-[#006948] bg-emerald-50 text-[#006948] font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span className="text-xs">BCA Virtual Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cc')}
                  className={`p-2.5 rounded border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'cc'
                      ? 'border-[#006948] bg-emerald-50 text-[#006948] font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Kartu Kredit</span>
                </button>
              </div>
            </div>

            {/* Active Payment Channel View */}
            {paymentMethod === 'qris' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded text-center space-y-3">
                <p className="text-xs text-slate-600">
                  Pindai kode QRIS di bawah menggunakan GoPay, OVO, BCA Mobile, Livin Mandiri, atau aplikasi perbankan apa pun:
                </p>

                {/* Simulated QR Box */}
                <div className="w-48 h-48 mx-auto bg-white p-3 rounded border border-slate-300 shadow-xs flex flex-col items-center justify-center relative">
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-slate-900 rounded-xs">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                            ? 'bg-white'
                            : 'bg-slate-900'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold font-mono text-[#006948] border border-emerald-600 shadow-sm">
                      QRIS RESMI
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-500">
                  Kode Referensi: <strong className="text-slate-800">QRIS-HB-{blueprint.code}-2025</strong>
                </div>
              </div>
            )}

            {paymentMethod === 'bca' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-mono">NOMOR VIRTUAL ACCOUNT:</span>
                  <span className="bg-emerald-100 text-[#006948] px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                    AKTIF 24 JAM
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded border border-slate-300 font-mono text-base font-bold text-slate-900">
                  <span>{vaNumber}</span>
                  <button
                    onClick={handleCopyVA}
                    className="flex items-center gap-1 text-xs text-[#006948] hover:text-[#005137] cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>

                <p className="text-slate-500 text-[11px]">
                  Pembayaran diverifikasi secara otomatis dalam 5-10 detik tanpa perlu unggah bukti transfer.
                </p>
              </div>
            )}

            {paymentMethod === 'cc' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 font-semibold block mb-1">
                    NOMOR KARTU KREDIT
                  </label>
                  <input
                    type="text"
                    defaultValue="4111 2222 3333 4444"
                    className="w-full p-2 border border-slate-300 rounded font-mono text-xs bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-semibold block mb-1">
                      MASA BERLAKU
                    </label>
                    <input
                      type="text"
                      defaultValue="12/28"
                      className="w-full p-2 border border-slate-300 rounded font-mono text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-semibold block mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      defaultValue="888"
                      className="w-full p-2 border border-slate-300 rounded font-mono text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Escrow Guarantee Pill */}
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-emerald-50/50 p-2.5 rounded border border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-[#006948] shrink-0" />
              <span>
                <strong>Garansi 100% Legal & SIMBG:</strong> Hak guna lisensi terdaftar resmi atas nama pembeli.
              </span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleSimulatePayment}
              className="w-full py-3 bg-[#006948] hover:bg-[#005137] text-white font-semibold text-sm rounded flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <span>Konfirmasi & Bayar Sekarang ({formattedPrice})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#006948]/20 border-t-[#006948] rounded-full animate-spin mx-auto" />
            <h4 className="font-bold text-slate-900 text-base">Memverifikasi Pembayaran Perbankan...</h4>
            <p className="text-xs text-slate-500 font-mono">
              GENERATING ENCRYPTED DOWNLOAD TOKENS // STANDAR DED & RAB
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#006948] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Pembayaran Berhasil!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Terima kasih, lisensi DED Anda telah terbit. Tautan unduhan master file dan faktur pajak
                telah dikirimkan ke <strong className="text-slate-800">{email}</strong>.
              </p>
            </div>

            {/* Downloadable Package Box */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#006948]/10 text-[#006948] flex items-center justify-center shrink-0">
                  <FileArchive className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {blueprint.code}_{blueprint.title.replace(/\s+/g, '_')}_DED_Paket_Lengkap.zip
                  </h5>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Ukuran: 68.4 MB · Format: AutoCAD DWG, PDF A3, Excel BoQ
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownloadFiles}
                className="w-full py-2.5 bg-[#006948] hover:bg-[#005137] text-white text-xs font-semibold rounded flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Paket Gambar Kerja Sekarang (ZIP)</span>
              </button>
            </div>

            {packageType === 'consultation' && (
              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-900 space-y-1">
                <strong>Jadwal Konsultasi Video Call 60 Menit:</strong>
                <p className="text-[11px] text-amber-800">
                  Tim dari {blueprint.architect.name} akan menghubungi WhatsApp/Email Anda dalam 1x24 jam untuk reservasi jadwal konsultasi advis tapak.
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded cursor-pointer"
              >
                Tutup & Kembali ke Beranda
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
