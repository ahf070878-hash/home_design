import { useState } from 'react';
import { ShoppingBag, Bookmark, Calculator, Menu, X, Code2 } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenArchitectModal: () => void;
  onOpenCalculator: () => void;
  onSelectCategory: (cat: string) => void;
  savedCount: number;
  onOpenSavedModal: () => void;
  onOpenCodeExport: () => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  onOpenArchitectModal,
  onOpenCalculator,
  onSelectCategory,
  savedCount,
  onOpenSavedModal,
  onOpenCodeExport,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);

  const scrollToCatalog = () => {
    const el = document.getElementById('katalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-[#006948] flex items-center justify-center text-white shadow-xs group-hover:bg-[#005137] transition-colors">
              {/* Architectural logo mark */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M3 10.5 12 3l9 7.5v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center">
              Huni<span className="text-[#006948]">Bangun</span>
              <span className="text-slate-400 font-medium text-base">.id</span>
            </span>
          </a>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
          <button
            onClick={scrollToCatalog}
            className="hover:text-[#006948] transition-colors cursor-pointer whitespace-nowrap"
          >
            Cari Desain
          </button>

          <div className="relative">
            <button
              onClick={() => setStyleDropdownOpen(!styleDropdownOpen)}
              onBlur={() => setTimeout(() => setStyleDropdownOpen(false), 200)}
              className="flex items-center gap-1 hover:text-[#006948] transition-colors cursor-pointer whitespace-nowrap"
            >
              Gaya Arsitektur
              <span className="text-xs">▾</span>
            </button>
            {styleDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-md shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                {[
                  { name: 'Tropis Modern', count: 420 },
                  { name: 'Minimalis', count: 310 },
                  { name: 'Japandi', count: 280 },
                  { name: 'Industrial', count: 130 },
                  { name: 'Klasik Kontemporer', count: 100 },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      onSelectCategory(item.name);
                      setStyleDropdownOpen(false);
                      scrollToCatalog();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#006948] flex items-center justify-between cursor-pointer"
                  >
                    <span>{item.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({item.count})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              onSelectCategory('PBG Ready');
              scrollToCatalog();
            }}
            className="hover:text-[#006948] transition-colors cursor-pointer whitespace-nowrap"
          >
            Koleksi Khusus
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('spotlight-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1 text-slate-700 hover:text-[#006948] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>🎨 Kustomisasi Material</span>
          </button>

          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1 text-[#006948] hover:text-[#005137] font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Kalkulator Lahan & RAB</span>
          </button>
        </nav>

        {/* Right Action Zone */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Code Export Button */}
          <button
            onClick={onOpenCodeExport}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#006948] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 sm:px-3 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap shadow-2xs"
            title="Ekspor Source Code (.ZIP) & Panduan GitHub"
          >
            <Code2 className="w-3.5 h-3.5 text-[#006948]" />
            <span className="font-mono font-bold text-[11px] sm:text-xs">Export Code</span>
          </button>

          <button
            onClick={onOpenSavedModal}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded px-2.5 py-1.5 transition-colors cursor-pointer"
            title="Desain Tersimpan"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono text-xs">{savedCount}</span>
          </button>

          <button
            onClick={onOpenArchitectModal}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#006948] bg-white border border-slate-200 hover:border-[#006948] px-3 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap"
          >
            <span className="text-[#006948] font-bold text-sm leading-none">+</span>
            <span>Upload Portofolio</span>
          </button>

          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-[#f2f4f6] hover:bg-[#e6e8ea] text-slate-800 text-xs font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer border border-[#e2e8f0]"
          >
            <ShoppingBag className="w-4 h-4 text-slate-700" />
            <span className="hidden sm:inline">Keranjang</span>
            <span className="bg-[#006948] text-white text-[11px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* User Profile Avatar */}
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center text-slate-600 font-bold text-xs">
            <span className="font-mono">AH</span>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-700 hover:text-slate-900 rounded"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          <button
            onClick={() => {
              onOpenCodeExport();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 w-full text-left py-2 text-sm text-[#006948] font-bold bg-emerald-50 px-3 rounded"
          >
            <Code2 className="w-4 h-4" />
            <span>Ekspor Source Code & Data (.ZIP)</span>
          </button>
          <button
            onClick={() => {
              scrollToCatalog();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-slate-800 font-medium"
          >
            Cari Desain Siap Bangun
          </button>
          <button
            onClick={() => {
              onOpenCalculator();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-[#006948] font-semibold"
          >
            Kalkulator Lahan & RAB
          </button>
          <button
            onClick={() => {
              onOpenArchitectModal();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-slate-800 font-medium"
          >
            Daftar Arsitek Mitra (Upload Portofolio)
          </button>
        </div>
      )}
    </header>
  );
}
