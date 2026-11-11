import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { BlueprintDesign } from '../types';
import { CATEGORIES } from '../data/mockData';
import BlueprintCard from './BlueprintCard';

interface CatalogSectionProps {
  blueprints: BlueprintDesign[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onSelectBlueprint: (blueprint: BlueprintDesign) => void;
  onBuyBlueprint: (blueprint: BlueprintDesign) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenCalculator: () => void;
}

export default function CatalogSection({
  blueprints,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  onSelectBlueprint,
  onBuyBlueprint,
  savedIds,
  onToggleSave,
  onOpenCalculator,
}: CatalogSectionProps) {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const sortOptions = [
    { label: 'Terpopuler (Paling Banyak Diunduh)', value: 'popular' },
    { label: 'Terbaru Ditambahkan', value: 'newest' },
    { label: 'Harga DED: Terendah ke Tertinggi', value: 'price_asc' },
    { label: 'Luas Lahan: Terkecil ke Terbesar', value: 'land_asc' },
    { label: 'Rating Arsitek Tertinggi', value: 'rating' },
  ];

  const currentSortLabel =
    sortOptions.find((s) => s.value === sortBy)?.label ||
    'Terpopuler (Paling Banyak Diunduh)';

  return (
    <section id="katalog-section" className="py-12 px-4 sm:px-6 max-w-[1440px] mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#006948] font-bold mb-1">
            KATALOG RESMI CETAK BIRU
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Koleksi Desain Rumah Siap Bangun
          </h2>
        </div>

        {/* Sort Dropdown */}
        <div className="relative self-start md:self-auto">
          <button
            type="button"
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span className="text-slate-400 font-mono">URUTKAN:</span>
            <span>{currentSortLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {sortDropdownOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded shadow-lg py-1 z-30 animate-in fade-in zoom-in-95">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onSortChange(opt.value);
                    setSortDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#006948] flex items-center justify-between cursor-pointer"
                >
                  <span>{opt.label}</span>
                  {sortBy === opt.value && <Check className="w-3.5 h-3.5 text-[#006948]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Pills / Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive =
            (cat.id === 'all' && selectedCategory === 'all') ||
            selectedCategory === cat.name;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id === 'all' ? 'all' : cat.name)}
              className={`px-3.5 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#006948] border-[#006948] text-white font-semibold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`ml-1.5 font-mono text-[11px] ${
                  isActive ? 'text-emerald-100' : 'text-slate-400'
                }`}
              >
                ({cat.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Blueprint Grid */}
      {blueprints.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded p-12 text-center my-6">
          <p className="text-slate-600 font-medium text-sm mb-2">
            Tidak ada desain yang sesuai dengan kriteria filter saat ini.
          </p>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs text-[#006948] font-bold hover:underline"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blueprints.map((item, index) => (
            <BlueprintCard
              key={item.id}
              blueprint={item}
              onSelect={onSelectBlueprint}
              onBuy={onBuyBlueprint}
              isSaved={savedIds.includes(item.id)}
              onToggleSave={onToggleSave}
              isFeaturedPrimary={index === 0}
            />
          ))}
        </div>
      )}

      {/* Custom Land Size Callout Banner */}
      <div className="mt-8 bg-[#f2f4f6] border border-[#e2e8f0] rounded p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#006948] flex items-center justify-center text-white shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Punya Ukuran Lahan Spesifik?</h4>
            <p className="text-xs text-slate-600">
              Gunakan filter kalkulator lahan atau ajukan konsultasi kustomisasi denah langsung ke studio arsitek.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCalculator}
          className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer shadow-xs"
        >
          Buka Semua 1.240 Dokumen
        </button>
      </div>
    </section>
  );
}
