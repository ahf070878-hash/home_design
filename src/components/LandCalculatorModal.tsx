import { useState } from 'react';
import { X, Calculator, Check, ArrowRight, Home, Building } from 'lucide-react';
import { BlueprintDesign } from '../types';

interface LandCalculatorModalProps {
  onClose: () => void;
  onApplyLandFilter: (width: number, length: number) => void;
  blueprints: BlueprintDesign[];
  onSelectBlueprint: (bp: BlueprintDesign) => void;
}

export default function LandCalculatorModal({
  onClose,
  onApplyLandFilter,
  blueprints,
  onSelectBlueprint,
}: LandCalculatorModalProps) {
  const [width, setWidth] = useState<number>(8);
  const [length, setLength] = useState<number>(15);
  const [levels, setLevels] = useState<number>(2);
  const [tier, setTier] = useState<'standard' | 'medium' | 'premium'>('medium');

  const landArea = width * length;
  const kdbRatio = 0.6; // 60% standard residential KDB
  const maxFootprint = Math.round(landArea * kdbRatio);
  const maxBuildingArea = Math.round(maxFootprint * levels * 0.95);

  const costPerMeterMap = {
    standard: 4200000,
    medium: 5200000,
    premium: 7800000,
  };

  const estimatedConstructionCost = maxBuildingArea * costPerMeterMap[tier];

  const formattedCost = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(estimatedConstructionCost);

  // Find blueprints that fit this lot (minLandWidth <= width && minLandLength <= length)
  const matchedBlueprints = blueprints.filter(
    (bp) => bp.minLandWidth <= width && bp.minLandLength <= length
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto cad-scrollbar relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#006948]/10 text-[#006948] flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Kalkulator Dimensi Lahan & Estimasi Anggaran (RAB)
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                REGULASI TATA RUANG PBG & EFISIENSI DENAH
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

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Inputs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-600 font-bold block mb-1">
                LEBAR MUKA LAHAN (METER)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="30"
                  step="0.5"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value) || 0)}
                  className="w-full p-2.5 border border-slate-300 rounded text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:border-[#006948]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                  m
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-slate-600 font-bold block mb-1">
                PANJANG KE BELAKANG (METER)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="8"
                  max="50"
                  step="0.5"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value) || 0)}
                  className="w-full p-2.5 border border-slate-300 rounded text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:border-[#006948]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                  m
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-slate-600 font-bold block mb-1">
                RENCANA TINGKAT LANTAI
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setLevels(1)}
                  className={`p-2 rounded text-xs font-bold border transition-colors cursor-pointer ${
                    levels === 1
                      ? 'border-[#006948] bg-emerald-50 text-[#006948]'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  1 Lantai
                </button>
                <button
                  type="button"
                  onClick={() => setLevels(2)}
                  className={`p-2 rounded text-xs font-bold border transition-colors cursor-pointer ${
                    levels === 2
                      ? 'border-[#006948] bg-emerald-50 text-[#006948]'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  2 Lantai
                </button>
              </div>
            </div>
          </div>

          {/* Construction Material Quality Tier */}
          <div>
            <label className="text-[11px] font-mono uppercase text-slate-600 font-bold block mb-2">
              SPESIFIKASI MATERIAL BANGUNAN:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTier('standard')}
                className={`p-3 rounded border text-left cursor-pointer transition-colors ${
                  tier === 'standard'
                    ? 'border-[#006948] bg-emerald-50/50 ring-1 ring-[#006948]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">Standar Finishing</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">± Rp 4,2 Jt / m²</div>
                <div className="text-[10px] text-slate-400 mt-1">Granit 60x60, Kusen Alum. 3", Cat Weatherproof</div>
              </button>

              <button
                type="button"
                onClick={() => setTier('medium')}
                className={`p-3 rounded border text-left cursor-pointer transition-colors ${
                  tier === 'medium'
                    ? 'border-[#006948] bg-emerald-50/50 ring-1 ring-[#006948]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">Tropis Menengah (Populer)</div>
                <div className="text-[11px] text-[#006948] font-mono font-bold mt-0.5">± Rp 5,2 Jt / m²</div>
                <div className="text-[10px] text-slate-400 mt-1">Batu alam, Kayu kamper/bengkirai, Toto sanitari</div>
              </button>

              <button
                type="button"
                onClick={() => setTier('premium')}
                className={`p-3 rounded border text-left cursor-pointer transition-colors ${
                  tier === 'premium'
                    ? 'border-[#006948] bg-emerald-50/50 ring-1 ring-[#006948]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">Mewah / Kontemporer</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">± Rp 7,8 Jt / m²</div>
                <div className="text-[10px] text-slate-400 mt-1">Smart home, Marmer impor, Kusen YKK/Tostem</div>
              </button>
            </div>
          </div>

          {/* Results Analysis Box */}
          <div className="bg-[#f2f4f6] border border-[#e2e8f0] rounded p-4 space-y-3">
            <div className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
              HASIL ANALISIS TATA RUANG PBG:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="text-[10px] font-mono text-slate-400 uppercase">LUAS TANAH</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">{landArea} m²</div>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="text-[10px] font-mono text-slate-400 uppercase">KDB AMAN (60%)</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">{maxFootprint} m²</div>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="text-[10px] font-mono text-slate-400 uppercase">EST. LUAS BANGUNAN</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">{maxBuildingArea} m²</div>
              </div>
              <div className="bg-white p-2.5 rounded border border-emerald-300 bg-emerald-50/30">
                <div className="text-[10px] font-mono text-[#006948] uppercase font-bold">EST. FISIK BANGUN</div>
                <div className="text-base font-bold font-mono text-[#006948] mt-0.5">{formattedCost}</div>
              </div>
            </div>
          </div>

          {/* Matched Designs from Catalog */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">
                Desain Siap Bangun yang Cocok untuk Lahan {width}x{length}m ({matchedBlueprints.length} ditemukan):
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto cad-scrollbar">
              {matchedBlueprints.map((bp) => (
                <div
                  key={bp.id}
                  onClick={() => {
                    onSelectBlueprint(bp);
                    onClose();
                  }}
                  className="p-2.5 border border-slate-200 rounded hover:border-[#006948] hover:bg-slate-50 transition-colors flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={bp.mainImage}
                    alt={bp.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded object-cover shrink-0"
                  />
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#006948] truncate">
                      {bp.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Lahan min. {bp.minLandWidth}x{bp.minLandLength}m · LB {bp.buildingArea}m²
                    </div>
                    <div className="text-xs font-bold font-mono text-[#006948]">
                      Rp {(bp.priceDED / 1000000).toFixed(1).replace('.', ',')} Jt
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => {
                onApplyLandFilter(width, length);
                onClose();
              }}
              className="px-5 py-2.5 bg-[#006948] hover:bg-[#005137] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Terapkan Filter Lahan ({width}x{length}m)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
