import { useState } from 'react';
import { Layers, ZoomIn, Info, Eye } from 'lucide-react';
import { BlueprintDesign } from '../types';

interface BlueprintViewerProps {
  blueprint: BlueprintDesign;
  onOpenSampleModal: () => void;
}

export default function BlueprintViewer({
  blueprint,
  onOpenSampleModal,
}: BlueprintViewerProps) {
  const [activeTab, setActiveTab] = useState<'fasad' | 'denah' | 'potongan' | 'interior'>('fasad');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const hotspots = [
    {
      id: 'courtyard',
      title: 'Inner Courtyard & Void Terbuka',
      desc: 'Taman dalam 3x4m sebagai paru-paru rumah, menciptakan sirkulasi udara silang (cross-ventilation) pasif.',
      x: '52%',
      y: '48%',
    },
    {
      id: 'carport',
      title: 'Carport 2 Mobil (5.0 x 5.0m)',
      desc: 'Pola lantai batu sikat berdrainase cepat, kemiringan 2% ke saluran luar.',
      x: '24%',
      y: '80%',
    },
    {
      id: 'living',
      title: 'Ruang Keluarga Double Height',
      desc: 'Ketinggian plafon 5.8m dengan bukaan kaca skylight tempered glass 8mm.',
      x: '50%',
      y: '68%',
    },
    {
      id: 'master',
      title: 'Master Bedroom Suite (Lantai 2)',
      desc: 'Kamar utama 4x5m berorientasi privat dengan walk-in closet dan kamar mandi dalam.',
      x: '75%',
      y: '35%',
    },
  ];

  return (
    <div className="space-y-3">
      {/* Main Viewport */}
      <div className="relative aspect-[16/10] bg-slate-950 rounded overflow-hidden border border-slate-300 shadow-xs group">
        {activeTab === 'fasad' && (
          <div className="w-full h-full relative">
            <img
              src={blueprint.mainImage}
              alt="Fasad Utama"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Top CAD Scale Tag */}
            <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-xs text-white px-3 py-1 rounded text-[11px] font-mono flex items-center gap-2 border border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-[#006948]" />
              <span>FASAD UTAMA — ELEVASI SELATAN (SCALE 1:100)</span>
            </div>
          </div>
        )}

        {activeTab === 'denah' && (
          <div className="w-full h-full bg-[#0f172a] blueprint-grid-dark relative p-6 flex items-center justify-center overflow-hidden">
            {/* Architectural CAD Blueprint Schematic */}
            <svg
              viewBox="0 0 800 500"
              className="w-full h-full text-slate-300 font-mono select-none"
            >
              {/* Grid Lines */}
              <defs>
                <pattern id="cadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="800" height="500" fill="url(#cadGrid)" />

              {/* Outer Boundary Lot 8m x 15m */}
              <rect
                x="140"
                y="50"
                width="520"
                height="400"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="6 3"
              />
              <text x="400" y="38" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">
                BATAS LAHAN: 8.00 METER × 15.00 METER (120 M²)
              </text>

              {/* Main Structural Walls (Lantai 1) */}
              {/* Carport */}
              <rect x="160" y="270" width="220" height="160" fill="#1e293b" fillOpacity="0.6" stroke="#e2e8f0" strokeWidth="2" />
              <text x="270" y="355" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">
                CARPORT 2 MOBIL (5.00 x 5.00)
              </text>

              {/* Ruang Tamu / Keluarga */}
              <rect x="380" y="220" width="260" height="210" fill="#1e293b" fillOpacity="0.4" stroke="#e2e8f0" strokeWidth="2" />
              <text x="510" y="330" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="bold">
                RUANG KELUARGA & MAKAN
              </text>
              <text x="510" y="350" textAnchor="middle" fill="#68dba9" fontSize="10">
                PLAFON DOUBLE HEIGHT +5.80M
              </text>

              {/* Inner Courtyard (Taman Tengah) */}
              <rect x="380" y="110" width="140" height="110" fill="#006948" fillOpacity="0.25" stroke="#34d399" strokeWidth="2" strokeDasharray="4 2" />
              <text x="450" y="165" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">
                INNER COURTYARD
              </text>
              <text x="450" y="180" textAnchor="middle" fill="#94a3b8" fontSize="9">
                (TAMAN KERING & VOID)
              </text>

              {/* Dapur & Pantry */}
              <rect x="520" y="110" width="120" height="110" fill="#1e293b" fillOpacity="0.5" stroke="#e2e8f0" strokeWidth="1.8" />
              <text x="580" y="170" textAnchor="middle" fill="#cbd5e1" fontSize="10">
                DAPUR
              </text>

              {/* Kamar Tidur Bawah / Tamu */}
              <rect x="160" y="110" width="220" height="160" fill="#1e293b" fillOpacity="0.5" stroke="#e2e8f0" strokeWidth="1.8" />
              <text x="270" y="195" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="600">
                KAMAR TIDUR (3.50 x 4.00)
              </text>

              {/* Taman Depan */}
              <rect x="160" y="70" width="480" height="40" fill="#064e3b" fillOpacity="0.2" stroke="#059669" strokeWidth="1" />
              <text x="400" y="94" textAnchor="middle" fill="#34d399" fontSize="10">
                GSB 3.00 M — TAMAN DEPAN & RESAPAN AIR HUJAN
              </text>

              {/* Dimension lines */}
              <line x1="120" y1="50" x2="120" y2="450" stroke="#64748b" strokeWidth="1.2" />
              <line x1="115" y1="50" x2="125" y2="50" stroke="#64748b" strokeWidth="1.5" />
              <line x1="115" y1="450" x2="125" y2="450" stroke="#64748b" strokeWidth="1.5" />
              <text x="105" y="255" textAnchor="middle" fill="#94a3b8" fontSize="11" transform="rotate(-90 105 255)">
                15.00 METER
              </text>
            </svg>

            {/* Clickable Interactive Hotspots */}
            {hotspots.map((h) => (
              <button
                key={h.id}
                onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
                style={{ left: h.x, top: h.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
              >
                <span className="relative flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-amber-500 border-2 border-slate-900 text-slate-900 text-[10px] font-bold items-center justify-center shadow-lg">
                    ●
                  </span>
                </span>

                {/* Hotspot Popover Tooltip */}
                {activeHotspot === h.id && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-white text-slate-900 p-3 rounded shadow-xl border border-slate-300 text-left z-30 animate-in fade-in zoom-in-95 pointer-events-auto">
                    <div className="text-xs font-bold text-[#006948] mb-1 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      {h.title}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{h.desc}</p>
                  </div>
                )}
              </button>
            ))}

            {/* Scale badge */}
            <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-xs text-white px-3 py-1 rounded text-[11px] font-mono flex items-center gap-2 border border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>DENAH ARSITEKTUR LT. 1 & 2 (SCALE 1:100 / AUTOCAD DWG READY)</span>
            </div>
          </div>
        )}

        {activeTab === 'potongan' && (
          <div className="w-full h-full bg-[#0b1329] blueprint-grid-dark relative p-6 flex items-center justify-center">
            {/* Cross Section SVG Schematic */}
            <svg viewBox="0 0 800 480" className="w-full h-full text-slate-300 font-mono select-none">
              {/* Foundation Footplates */}
              <rect x="180" y="380" width="90" height="30" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="360" y="380" width="90" height="30" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="540" y="380" width="90" height="30" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="120" y1="380" x2="680" y2="380" stroke="#68dba9" strokeWidth="2" />
              <text x="690" y="385" fill="#68dba9" fontSize="10">EL -1.20M (PONDASI CAKAR AYAM)</text>

              {/* Ground Floor Level */}
              <line x1="120" y1="320" x2="680" y2="320" stroke="#f8fafc" strokeWidth="2.5" />
              <text x="690" y="325" fill="#f8fafc" fontSize="10" fontWeight="bold">EL +0.00M (LANTAI 1)</text>

              {/* Columns */}
              <rect x="215" y="190" width="20" height="130" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
              <rect x="395" y="190" width="20" height="130" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
              <rect x="575" y="190" width="20" height="130" fill="#334155" stroke="#94a3b8" strokeWidth="1" />

              {/* Floor 2 Slab */}
              <line x1="140" y1="190" x2="660" y2="190" stroke="#38bdf8" strokeWidth="3" />
              <text x="670" y="195" fill="#38bdf8" fontSize="10" fontWeight="bold">EL +3.80M (LANTAI 2 / BALOK STRUKTUR)</text>

              {/* Roof Truss & Pitch */}
              <polygon points="140,190 400,60 660,190" fill="#1e293b" fillOpacity="0.4" stroke="#e2e8f0" strokeWidth="2" />
              <text x="400" y="50" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">
                EL +7.20M (RANGKA BAJA RINGAN SNI & GENTENG KANMURI)
              </text>
            </svg>

            <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-xs text-white px-3 py-1 rounded text-[11px] font-mono flex items-center gap-2 border border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>POTONGAN MEMANJANG A-A (SCALE 1:100 / STRUKTUR GEMPA SNI 1726)</span>
            </div>
          </div>
        )}

        {activeTab === 'interior' && (
          <div className="w-full h-full relative">
            <img
              src={blueprint.interiorImage}
              alt="3D Interior"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-xs text-white px-3 py-1 rounded text-[11px] font-mono flex items-center gap-2 border border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>3D INTERIOR RENDERING — RUANG KELUARGA & COURTYARD</span>
            </div>
          </div>
        )}

        {/* View full / Zoom sample button */}
        <button
          onClick={onOpenSampleModal}
          className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white px-2.5 py-1 rounded text-xs flex items-center gap-1.5 backdrop-blur-xs transition-colors cursor-pointer border border-white/20"
        >
          <ZoomIn className="w-3.5 h-3.5" />
          <span>Zoom CAD Blueprint</span>
        </button>
      </div>

      {/* 4 Thumbnail Buttons (Exact replica from screenshot) */}
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('fasad')}
          className={`p-1.5 rounded border text-left transition-all cursor-pointer flex flex-col items-center sm:items-start ${
            activeTab === 'fasad'
              ? 'border-[#006948] bg-emerald-50/50 shadow-xs ring-1 ring-[#006948]'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="w-full aspect-[16/10] bg-slate-100 rounded overflow-hidden mb-1">
            <img
              src={blueprint.mainImage}
              alt="Thumb Fasad"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[11px] font-semibold text-slate-800 truncate w-full text-center sm:text-left">
            Fasad Utama
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('denah')}
          className={`p-1.5 rounded border text-left transition-all cursor-pointer flex flex-col items-center sm:items-start ${
            activeTab === 'denah'
              ? 'border-[#006948] bg-emerald-50/50 shadow-xs ring-1 ring-[#006948]'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="w-full aspect-[16/10] bg-slate-900 rounded overflow-hidden mb-1 flex items-center justify-center p-1">
            {/* Mini SVG Denah */}
            <svg viewBox="0 0 60 40" className="w-full h-full text-emerald-400">
              <rect x="5" y="5" width="50" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="25" y1="5" x2="25" y2="35" stroke="currentColor" strokeWidth="1" />
              <line x1="5" y1="20" x2="55" y2="20" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold text-slate-800 truncate w-full text-center sm:text-left">
            Denah Lt 1 & 2
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('potongan')}
          className={`p-1.5 rounded border text-left transition-all cursor-pointer flex flex-col items-center sm:items-start ${
            activeTab === 'potongan'
              ? 'border-[#006948] bg-emerald-50/50 shadow-xs ring-1 ring-[#006948]'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="w-full aspect-[16/10] bg-slate-900 rounded overflow-hidden mb-1 flex items-center justify-center p-1">
            {/* Mini SVG Potongan */}
            <svg viewBox="0 0 60 40" className="w-full h-full text-sky-400">
              <polygon points="10,35 30,10 50,35" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="5" y1="35" x2="55" y2="35" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold text-slate-800 truncate w-full text-center sm:text-left">
            Potongan A-A
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('interior')}
          className={`p-1.5 rounded border text-left transition-all cursor-pointer flex flex-col items-center sm:items-start ${
            activeTab === 'interior'
              ? 'border-[#006948] bg-emerald-50/50 shadow-xs ring-1 ring-[#006948]'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="w-full aspect-[16/10] bg-slate-100 rounded overflow-hidden mb-1">
            <img
              src={blueprint.interiorImage}
              alt="Thumb Interior"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[11px] font-semibold text-slate-800 truncate w-full text-center sm:text-left">
            3D Interior
          </span>
        </button>
      </div>
    </div>
  );
}
