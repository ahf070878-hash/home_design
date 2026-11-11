import { useState } from 'react';
import { X, Download, Eye, Layers, ZoomIn, ZoomOut, Check } from 'lucide-react';
import { BlueprintDesign } from '../types';

interface SampleWatermarkModalProps {
  blueprint: BlueprintDesign;
  onClose: () => void;
  onProceedToBuy: () => void;
}

export default function SampleWatermarkModal({
  blueprint,
  onClose,
  onProceedToBuy,
}: SampleWatermarkModalProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayer, setActiveLayer] = useState<'all' | 'arch' | 'structure' | 'mep'>('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadSample = () => {
    const dummyBlob = new Blob(
      [
        `SAMPLE WATERMARK DED - HUNIBANGUN.ID\n` +
          `====================================\n` +
          `Dokumen ini adalah sampel preview ber-watermark untuk evaluasi denah tapak.\n\n` +
          `Kode Desain: ${blueprint.code}\n` +
          `Judul: ${blueprint.title}\n` +
          `Ukuran Lahan: ${blueprint.minLandWidth} x ${blueprint.minLandLength} Meter (${blueprint.landArea} m²)\n` +
          `Luas Bangunan: ${blueprint.buildingArea} m²\n` +
          `Kamar: ${blueprint.bedrooms} KT / ${blueprint.bathrooms} KM / ${blueprint.carport} Carport\n` +
          `Studio: ${blueprint.architect.name} (${blueprint.architect.straNo})\n\n` +
          `Untuk master file DWG editable dan BoQ RAB Excel, silakan lakukan pembelian paket resmi di https://hunibangun.id.`,
      ],
      { type: 'application/pdf' }
    );
    const url = URL.createObjectURL(dummyBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAMPLE_WATERMARK_${blueprint.code}_Denah_A3.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top CAD Toolbar */}
        <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-3">
            <span className="bg-[#006948] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
              WATERMARK PREVIEW
            </span>
            <span className="font-mono text-slate-300">
              {blueprint.code} — {blueprint.title} (LEMBAR ARS-01 // SCALE 1:100)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-800 rounded border border-slate-700 text-slate-300">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                className="p-1.5 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[11px] font-mono">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2, z + 0.25))}
                className="p-1.5 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport with Canvas & Watermark */}
        <div className="flex-1 bg-[#0b1329] blueprint-grid-dark relative overflow-auto p-8 flex items-center justify-center cad-scrollbar">
          <div
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
            className="transition-transform duration-200 relative bg-white border-2 border-slate-400 w-[720px] h-[480px] p-6 shadow-2xl shrink-0 select-none overflow-hidden"
          >
            {/* Architectural Border & Title Block */}
            <div className="absolute inset-3 border-2 border-slate-900 pointer-events-none" />
            <div className="absolute right-4 bottom-4 w-56 border-t-2 border-l-2 border-slate-900 p-2 bg-white text-[10px] font-mono text-slate-900">
              <div className="font-bold">{blueprint.architect.name}</div>
              <div className="text-[9px] text-slate-600">STRA: {blueprint.architect.straNo}</div>
              <div className="border-t border-slate-300 mt-1 pt-1 flex justify-between">
                <span>SKALA: 1:100</span>
                <span>LEMBAR: 01 / {blueprint.totalSheets}</span>
              </div>
            </div>

            {/* Drawing Content */}
            <div className="w-full h-full relative p-6">
              {/* Floorplan Geometry */}
              <svg viewBox="0 0 600 360" className="w-full h-full">
                {/* Outer Wall Boundary */}
                <rect x="80" y="30" width="440" height="280" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" />

                {/* Rooms */}
                <rect x="90" y="40" width="180" height="130" fill="none" stroke="#0f172a" strokeWidth="2" />
                <text x="180" y="105" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="bold">
                  KAMAR TIDUR UTAMA (3.5 x 4.0)
                </text>

                <rect x="270" y="40" width="120" height="130" fill="#ecfdf5" stroke="#059669" strokeWidth="2" strokeDasharray="3 2" />
                <text x="330" y="105" textAnchor="middle" fill="#065f46" fontSize="10" fontWeight="bold">
                  INNER COURTYARD
                </text>

                <rect x="390" y="40" width="120" height="130" fill="none" stroke="#0f172a" strokeWidth="2" />
                <text x="450" y="105" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="bold">
                  DAPUR & PANTRY
                </text>

                <rect x="90" y="170" width="220" height="130" fill="#f1f5f9" stroke="#0f172a" strokeWidth="2" />
                <text x="200" y="240" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="bold">
                  CARPORT 2 MOBIL (5.0 x 5.0)
                </text>

                <rect x="310" y="170" width="200" height="130" fill="none" stroke="#0f172a" strokeWidth="2" />
                <text x="410" y="240" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="bold">
                  RUANG KELUARGA & MAKAN
                </text>

                {/* Dimension Notations */}
                <line x1="80" y1="20" x2="520" y2="20" stroke="#0284c7" strokeWidth="1" />
                <text x="300" y="15" textAnchor="middle" fill="#0284c7" fontSize="9" fontWeight="bold">
                  8.00 METER
                </text>
              </svg>

              {/* Big Diagonal Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-[-25deg]">
                <div className="text-center select-none opacity-20">
                  <div className="text-4xl font-extrabold text-red-600 tracking-wider">
                    SAMPLE PREVIEW WATERMARK
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-800 mt-2">
                    HUNIBANGUN.ID — BUKAN UNTUK EKSEKUSI LAPANGAN
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            Berkas lengkap mencakup 42 lembar DED (Arsitektur, Struktur SNI, MEP) dan formula RAB Excel.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSample}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? 'Sample Terunduh!' : 'Unduh Sample PDF'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onProceedToBuy();
              }}
              className="px-4 py-2 bg-[#006948] hover:bg-[#005137] text-white font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Beli Versi Penuh Bebas Watermark</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
