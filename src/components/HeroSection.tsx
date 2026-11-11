import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, RotateCcw, Play, Pause, Sparkles } from 'lucide-react';
import { FilterState } from '../types';

interface HeroSectionProps {
  filter: FilterState;
  onFilterChange: (newFilter: Partial<FilterState>) => void;
  onSearch: () => void;
}

export default function HeroSection({
  filter,
  onFilterChange,
  onSearch,
}: HeroSectionProps) {
  const [openDropdown, setOpenDropdown] = useState<'width' | 'style' | 'room' | null>(null);

  // Background Video State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  // Auto-play once on initial load
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const playVideo = () => {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasEnded(false);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    };

    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener('canplay', playVideo, { once: true });
    }

    return () => {
      video.removeEventListener('canplay', playVideo);
    };
  }, []);

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video
      .play()
      .then(() => {
        setIsPlaying(true);
        setHasEnded(false);
      })
      .catch(() => {
        setIsPlaying(false);
      });
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (hasEnded) {
      handleReplay();
      return;
    }

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const landWidthOptions = [
    { label: 'Semua Lebar Lahan', value: 'all' },
    { label: 'Lebar 6m – 7m (Lahan Mungil)', value: '6-7' },
    { label: 'Lebar 8m – 12m (Paling Populer)', value: '8-12' },
    { label: 'Lebar > 12m (Kavling Lebar)', value: '>12' },
  ];

  const styleOptions = [
    { label: 'Semua Gaya Arsitektur', value: 'all' },
    { label: 'Tropis Modern (Sirkulasi Bagus)', value: 'Tropis Modern' },
    { label: 'Minimalis Kontemporer', value: 'Minimalis' },
    { label: 'Japandi (Zen & Ramah Cahaya)', value: 'Japandi' },
    { label: 'Industrial Raw Brick', value: 'Industrial' },
    { label: 'Klasik Kontemporer', value: 'Klasik Kontemporer' },
  ];

  const roomOptions = [
    { label: 'Semua Konfigurasi Kamar', value: 'all' },
    { label: '2 – 3 Kamar Tidur', value: '3' },
    { label: '4 Kamar Tidur + 1 ART', value: '4' },
    { label: '5+ Kamar Tidur (Mansion)', value: '5' },
  ];

  const handlePopularTagClick = (tag: string) => {
    if (tag.includes('8x15m')) {
      onFilterChange({ landWidth: '8-12', searchQuery: '8x15' });
    } else if (tag.includes('Rumah 2 Lantai')) {
      onFilterChange({ searchQuery: '2 Lantai' });
    } else if (tag.includes('Rooftop Garden')) {
      onFilterChange({ searchQuery: 'Rooftop' });
    } else if (tag.includes('Villa Tropis')) {
      onFilterChange({ architectStyle: 'Tropis Modern', selectedCategory: 'Tropis Modern' });
    } else if (tag.includes('< Rp 700 Jt')) {
      onFilterChange({ searchQuery: '650' });
    }
    onSearch();
  };

  const getWidthDisplayLabel = () => {
    return landWidthOptions.find((o) => o.value === filter.landWidth)?.label || 'Lebar 8m – 12m (Paling Populer)';
  };

  const getStyleDisplayLabel = () => {
    return styleOptions.find((o) => o.value === filter.architectStyle)?.label || 'Tropis Modern (Sirkulasi Bagus)';
  };

  const getRoomDisplayLabel = () => {
    return roomOptions.find((o) => o.value === filter.roomConfig)?.label || '4 Kamar Tidur + 1 ART';
  };

  return (
    <section className="relative pt-14 pb-18 px-4 sm:px-6 bg-slate-950 overflow-hidden flex flex-col justify-center min-h-[560px]">
      {/* 1. Background Video Layer with Single Play & Manual Replay */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          preload="auto"
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover scale-105 opacity-100 transition-opacity duration-1000"
        >
          <source src="/assets/aistudio/home_design_b8cf1fa0.mp4" type="video/mp4" />
          <source src="/assets/aistudio/home_design_b8cf1fa0.mov" type="video/quicktime" />
        </video>

        {/* Transparent Overlay (no dark tint blocking the video) */}
        <div className="absolute inset-0 bg-transparent" />
      </div>

      {/* 2. Foreground Hero Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto text-center w-full">
        {/* Top Kicker Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-slate-900/80 border border-emerald-500/30 rounded-full text-xs font-semibold text-[#68dba9] mb-5 backdrop-blur-md shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#006948] animate-pulse" />
          <span>MARKETPLACE BLUEPRINT ARSITEKTUR #1 DI INDONESIA</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.18] max-w-4xl mx-auto mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
          Unduh Blueprint Arsitek Profesional —{' '}
          <span className="text-[#68dba9] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">Siap Bangun</span>, Standar SNI, & Izin PBG
        </h1>

        {/* Subtitle */}
        <p className="text-white text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] font-medium">
          Ratusan rancangan rumah siap pakai karya arsitek lokal terkurasi. Beli dokumen gambar
          kerja lengkap (DED) dan bangun bersama kontraktor pilihan Anda tanpa risiko deviasi
          struktural.
        </p>

        {/* Multi-Parameter Filter Card Container */}
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-lg border border-white/20 shadow-xl p-2 sm:p-2.5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            {/* Filter 1: Lebar Muka Lahan */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'width' ? null : 'width')}
                className="w-full text-left px-3.5 py-2.5 rounded bg-[#f8fafc] hover:bg-[#f1f5f9] border border-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="truncate pr-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <span>📐</span> LEBAR MUKA LAHAN
                  </div>
                  <div className="text-xs font-semibold text-slate-900 truncate">
                    {getWidthDisplayLabel()}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>

              {openDropdown === 'width' && (
                <div className="absolute top-full left-0 mt-1 w-full sm:w-64 bg-white border border-slate-200 rounded shadow-lg py-1 z-30 text-left animate-in fade-in zoom-in-95">
                  {landWidthOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onFilterChange({ landWidth: opt.value });
                        setOpenDropdown(null);
                      }}
                      className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#006948] flex items-center justify-between text-left cursor-pointer"
                    >
                      <span>{opt.label}</span>
                      {filter.landWidth === opt.value && <Check className="w-3.5 h-3.5 text-[#006948]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter 2: Gaya Arsitektur */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'style' ? null : 'style')}
                className="w-full text-left px-3.5 py-2.5 rounded bg-[#f8fafc] hover:bg-[#f1f5f9] border border-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="truncate pr-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <span>🏛️</span> GAYA ARSITEKTUR
                  </div>
                  <div className="text-xs font-semibold text-slate-900 truncate">
                    {getStyleDisplayLabel()}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>

              {openDropdown === 'style' && (
                <div className="absolute top-full left-0 mt-1 w-full sm:w-64 bg-white border border-slate-200 rounded shadow-lg py-1 z-30 text-left animate-in fade-in zoom-in-95">
                  {styleOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onFilterChange({
                          architectStyle: opt.value,
                          selectedCategory: opt.value === 'all' ? 'all' : opt.value,
                        });
                        setOpenDropdown(null);
                      }}
                      className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#006948] flex items-center justify-between text-left cursor-pointer"
                    >
                      <span>{opt.label}</span>
                      {filter.architectStyle === opt.value && <Check className="w-3.5 h-3.5 text-[#006948]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter 3: Konfigurasi Kamar */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'room' ? null : 'room')}
                className="w-full text-left px-3.5 py-2.5 rounded bg-[#f8fafc] hover:bg-[#f1f5f9] border border-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="truncate pr-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <span>🛏️</span> KONFIGURASI KAMAR
                  </div>
                  <div className="text-xs font-semibold text-slate-900 truncate">
                    {getRoomDisplayLabel()}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>

              {openDropdown === 'room' && (
                <div className="absolute top-full left-0 mt-1 w-full sm:w-64 bg-white border border-slate-200 rounded shadow-lg py-1 z-30 text-left animate-in fade-in zoom-in-95">
                  {roomOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onFilterChange({ roomConfig: opt.value });
                        setOpenDropdown(null);
                      }}
                      className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#006948] flex items-center justify-between text-left cursor-pointer"
                    >
                      <span>{opt.label}</span>
                      {filter.roomConfig === opt.value && <Check className="w-3.5 h-3.5 text-[#006948]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter CTA Button */}
            <div>
              <button
                type="button"
                onClick={onSearch}
                className="w-full h-[46px] bg-[#006948] hover:bg-[#005137] active:bg-[#003d29] text-white font-semibold text-xs sm:text-sm rounded flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Search className="w-4 h-4" />
                <span>Cari Desain</span>
              </button>
            </div>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-xs text-slate-300">
          <span className="font-mono text-[11px] font-semibold tracking-wider text-slate-400">
            PENCARIAN POPULER:
          </span>
          {[
            'Lahan 8x15m',
            'Rumah 2 Lantai',
            'Rooftop Garden',
            'Villa Tropis',
            'Est. Fisik < Rp 700 Jt',
          ].map((tag, idx) => (
            <button
              key={tag}
              onClick={() => handlePopularTagClick(tag)}
              className="text-slate-300 hover:text-[#68dba9] hover:underline cursor-pointer transition-colors"
            >
              {tag}
              {idx < 4 && <span className="ml-2 text-slate-600" aria-hidden="true">·</span>}
            </button>
          ))}
        </div>

        {/* 3. Floating Background Video Controls Pill */}
        <div className="mt-8 inline-flex items-center gap-3 px-3 py-1.5 bg-slate-900/80 border border-slate-700/60 rounded-full backdrop-blur-md text-xs text-slate-300 shadow-md">
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
            <span>3D WALKTHROUGH BACKGROUND</span>
            {hasEnded && <span className="text-amber-400 font-sans text-[10px]">(Selesai)</span>}
          </span>

          <span className="text-slate-600">|</span>

          {/* Manual Replay Button */}
          <button
            type="button"
            onClick={handleReplay}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-[#68dba9] hover:text-white transition-colors cursor-pointer"
            title="Putar ulang video background dari awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Putar Ulang Video</span>
          </button>

          <span className="text-slate-600">|</span>

          {/* Play/Pause Toggle */}
          <button
            type="button"
            onClick={togglePlay}
            className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
            title={isPlaying ? 'Jeda background' : 'Lanjutkan background'}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
          </button>
        </div>
      </div>
    </section>
  );
}
