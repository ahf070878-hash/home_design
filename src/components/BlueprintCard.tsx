import { Bookmark, Star, ArrowRight } from 'lucide-react';
import { BlueprintDesign } from '../types';

interface BlueprintCardProps {
  blueprint: BlueprintDesign;
  onSelect: (blueprint: BlueprintDesign) => void;
  onBuy: (blueprint: BlueprintDesign) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  isFeaturedPrimary?: boolean;
}

export default function BlueprintCard({
  blueprint,
  onSelect,
  onBuy,
  isSaved,
  onToggleSave,
  isFeaturedPrimary,
}: BlueprintCardProps) {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(blueprint.priceDED);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelect(blueprint)}>
        <img
          src={blueprint.mainImage}
          alt={blueprint.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges Row */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded tracking-wider">
              LAHAN MIN. {blueprint.minLandWidth}x{blueprint.minLandLength}m ({blueprint.landArea} m²)
            </span>
            <span className="bg-[#006948]/90 backdrop-blur-xs text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded tracking-wider font-semibold">
              {blueprint.badgeTag}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(blueprint.id);
            }}
            className="pointer-events-auto w-7 h-7 bg-white/90 hover:bg-white text-slate-700 hover:text-[#006948] rounded flex items-center justify-center transition-colors shadow-xs"
            title={isSaved ? 'Hapus Simpanan' : 'Simpan Desain'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#006948] text-[#006948]' : ''}`} />
          </button>
        </div>

        {/* Bottom CAD Info Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-slate-900/85 backdrop-blur-xs text-white px-3 py-1 text-[11px] font-mono flex items-center justify-between">
          <span className="flex items-center gap-1 text-slate-200">
            <span>📐</span> LB {blueprint.buildingArea} m² ({blueprint.levels} Lt)
          </span>
          <span className="tracking-widest text-slate-300 font-semibold">
            KODE: {blueprint.code}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Studio & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium text-slate-700 truncate mr-2">
              {blueprint.architect.name}
            </span>
            <div className="flex items-center gap-1 shrink-0 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-slate-800 text-xs font-mono">{blueprint.rating}</span>
              <span className="text-slate-400 text-[11px]">({blueprint.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(blueprint)}
            className="font-bold text-slate-900 text-base leading-snug hover:text-[#006948] transition-colors cursor-pointer mb-2 line-clamp-1"
          >
            {blueprint.title}
          </h3>

          {/* Specs Ribbon */}
          <div className="bg-[#f8fafc] border border-slate-100 rounded px-2.5 py-1.5 text-xs text-slate-600 flex items-center gap-2 mb-4 font-mono">
            <span>🛏️ {blueprint.bedrooms} KT</span>
            <span className="text-slate-300">·</span>
            <span>🛁 {blueprint.bathrooms} KM</span>
            <span className="text-slate-300">·</span>
            <span>🚗 {blueprint.carport} Mobil</span>
            <span className="text-slate-300">·</span>
            <span className="text-[#006948] font-sans font-medium">{blueprint.featureHighlight}</span>
          </div>
        </div>

        {/* Footer Pricing & CTA */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 leading-none">
              LISENSI DED LENGKAP
            </div>
            <div className="text-base font-bold font-mono text-slate-900 mt-1">
              {formattedPrice}
            </div>
          </div>

          {isFeaturedPrimary ? (
            <button
              onClick={() => onBuy(blueprint)}
              className="bg-[#006948] hover:bg-[#005137] text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <span>Beli Paket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => onSelect(blueprint)}
              className="border border-slate-300 hover:border-slate-800 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold px-3 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Lihat Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
