import { useState } from 'react';
import {
  Check,
  Sparkles,
  Download,
  Info,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Eye,
  Table,
  Tag,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import {
  BlueprintDesign,
  CustomMaterialSelections,
  MaterialCategory,
  MaterialOption,
  RoomPerspective,
} from '../types';
import {
  MATERIAL_CATEGORIES,
  MATERIAL_OPTIONS,
  ROOM_PERSPECTIVES,
  calculateRabVariables,
} from '../data/materialsData';

interface MaterialCustomizerProps {
  blueprint: BlueprintDesign;
  customSelections: CustomMaterialSelections;
  onUpdateSelection: (category: MaterialCategory, option: MaterialOption) => void;
  onResetSelections: () => void;
  onOpenCheckoutWithCustomSpecs: () => void;
}

export default function MaterialCustomizer({
  blueprint,
  customSelections,
  onUpdateSelection,
  onResetSelections,
  onOpenCheckoutWithCustomSpecs,
}: MaterialCustomizerProps) {
  const [activeRoom, setActiveRoom] = useState<RoomPerspective>('living');
  const [activeCategory, setActiveCategory] = useState<MaterialCategory>('lantai');
  const [activeViewMode, setActiveViewMode] = useState<'catalog' | 'rabTable'>('catalog');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Calculate dynamic RAB variables
  const rabData = calculateRabVariables(customSelections, blueprint.buildingArea);

  // Format currency helpers
  const formatIDR = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  // Base physical construction cost baseline
  const baseCostNumeric = 650000000; // Rp 650 Juta
  const updatedTotalPhysicalCost = baseCostNumeric + rabData.finishCostDelta;

  const activeRoomData = ROOM_PERSPECTIVES.find((r) => r.id === activeRoom) || ROOM_PERSPECTIVES[0];
  const activeCategoryData = MATERIAL_CATEGORIES.find((c) => c.id === activeCategory)!;
  const currentOptions = MATERIAL_OPTIONS[activeCategory];

  // Generate customized BoQ/RKS specification & RAB variable spreadsheet download
  const handleDownloadSpecSheet = () => {
    let rabTableText = '';
    rabData.items.forEach((item, index) => {
      rabTableText +=
        `${index + 1}. [${item.code}] ${item.categoryLabel}\n` +
        `   Komponen: ${item.brand} - ${item.componentName}\n` +
        `   Spesifikasi: ${item.spec}\n` +
        `   Volume: ${item.volume} ${item.unit} | Harga Bahan: ${formatIDR(item.unitPrice)} | Upah: ${formatIDR(item.laborPrice)}\n` +
        `   Subtotal Pekerjaan: ${formatIDR(item.subtotal)}\n\n`;
    });

    const textContent =
      `HUNIBANGUN.ID — LEMBAR SPESIFIKASI MATERIAL KUSTOMISASI KLIEN & VARIABEL RAB (BoQ)\n` +
      `========================================================================================\n\n` +
      `Proyek Desain: ${blueprint.title} (${blueprint.code})\n` +
      `Studio Arsitek: ${blueprint.architect.name} (STRA: ${blueprint.architect.straNo})\n` +
      `Luas Bangunan: ${blueprint.buildingArea} m² / Luas Tanah: ${blueprint.landArea} m²\n` +
      `Tanggal Pembuatan: ${new Date().toLocaleDateString('id-ID')}\n\n` +
      `TABEL RINCIAN VARIABEL ANGGARAN BIAYA (RAB FINISHING KUSTOMISASI):\n` +
      `----------------------------------------------------------------------------------------\n` +
      rabTableText +
      `----------------------------------------------------------------------------------------\n` +
      `TOTAL ANGGARAN FINISHING VARIABEL: ${formatIDR(rabData.totalVariableFinishing)}\n` +
      `STANDAR BASELINE DED ACUAN: Rp 78.600.000\n` +
      `SELISIH PENYESUAIAN MATERIAL: ${rabData.finishCostDelta >= 0 ? '+' : ''}${formatIDR(rabData.finishCostDelta)}\n` +
      `ESTIMASI TOTAL ANGGARAN FISIK (RAB): ${formatIDR(updatedTotalPhysicalCost)}\n\n` +
      `FORMULA PERHITUNGAN VARIABEL:\n` +
      `Subtotal = Volume (m²/Unit) × [Harga Satuan Bahan + Upah Pasang Satuan]\n\n` +
      `Catatan: Berkas ini dapat langsung dibuka di Microsoft Excel / Google Sheets untuk pengawasan di lapangan.`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RAB_Variabel_Finishing_${blueprint.code}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 sm:p-6 shadow-xs space-y-6">
      {/* 1. Header Studio Kustomisasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#006948]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#006948] font-bold">
              STUDIO SIMULASI RUANGAN & VARIABEL RAB (BoQ)
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            Visualisasi Ruangan & Kustomisasi Komponen: {blueprint.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih visual ruangan untuk melihat penataan finishing secara langsung. Komponen yang Anda
            pilih otomatis menjadi variabel terhitung dalam Rencana Anggaran Biaya (RAB).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onResetSelections}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded transition-colors cursor-pointer bg-slate-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>
        </div>
      </div>

      {/* 2. Room Selector Bar: Pelanggan Memilih Visual Ruangan Sebelum/Saat Memilih Material */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 font-mono flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#006948]" />
            <span>PILIH VISUAL RUANGAN (PERSPEKTIF 3D):</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Klik ruangan untuk melihat simulasi material di area tersebut
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {ROOM_PERSPECTIVES.map((room) => {
            const isSelected = activeRoom === room.id;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => {
                  setActiveRoom(room.id);
                  // Automatically switch active category to first applicable category in that room
                  if (!room.applicableCategories.includes(activeCategory)) {
                    setActiveCategory(room.applicableCategories[0]);
                  }
                }}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'border-[#006948] bg-emerald-50/50 ring-2 ring-[#006948]/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{room.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {room.name.split('(')[0]}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {room.subtitle.split('&')[0]}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-1.5 right-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#006948] block animate-ping" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Split Layout: Left is Room Perspective Visualizer, Right is Customizer/RAB Mode */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Dynamic Room Visualizer with Interactive Hotspots */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
              <span>{activeRoomData.icon}</span>
              <span className="uppercase">{activeRoomData.name}</span>
            </span>
            <span className="text-[10px] bg-emerald-100 text-[#006948] px-2 py-0.5 rounded font-bold">
              INTERAKTIF
            </span>
          </div>

          {/* Interactive Room Canvas */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-300 shadow-md bg-slate-950 flex flex-col justify-between select-none">
            {/* Background Perspective Room Rendering (Dynamic per activeRoom) */}
            {activeRoom === 'living' && (
              <div className="absolute inset-0 flex flex-col">
                {/* Ceiling Plane with Void Height Effect */}
                <div
                  style={{ backgroundColor: customSelections.plafon.colorHex || '#FFFFFF' }}
                  className="h-24 relative overflow-hidden transition-colors duration-500 border-b border-black/15 shadow-inner"
                >
                  {/* Subtle Wood Slat or Acoustic Texture overlay */}
                  {customSelections.plafon.id === 'pl-shunda-wood' ? (
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_14px,rgba(0,0,0,0.15)_14px,rgba(0,0,0,0.15)_16px)]" />
                  ) : customSelections.plafon.id === 'pl-knauf-acoustic' ? (
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:8px_8px]" />
                  ) : null}

                  {/* Ceiling Hotspot Pin */}
                  <button
                    type="button"
                    onClick={() => setActiveCategory('plafon')}
                    className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/75 hover:bg-black text-white px-2 py-1 rounded text-[9px] font-mono backdrop-blur-xs transition-all shadow-md cursor-pointer border border-white/20"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Plafon: {customSelections.plafon.brand}</span>
                  </button>
                </div>

                {/* Living Room Wall & Huge Glazed Sliding Doors */}
                <div
                  style={{ backgroundColor: customSelections.dinding.colorHex || '#FAF9F6' }}
                  className="flex-1 relative flex items-center justify-between px-6 transition-colors duration-500 border-y border-black/10"
                >
                  {/* Wall Paint Hotspot Pin */}
                  <button
                    type="button"
                    onClick={() => setActiveCategory('dinding')}
                    className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/75 hover:bg-black text-white px-2 py-1 rounded text-[9px] font-mono backdrop-blur-xs transition-all shadow-md cursor-pointer border border-white/20"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Cat Dinding: {customSelections.dinding.brand} ({customSelections.dinding.colorName?.split(' ')[0]})</span>
                  </button>

                  {/* Architectural Sliding Glass Door (Pintu & Jendela) */}
                  <div
                    style={{
                      borderColor: customSelections.pintuJendela.colorHex || '#1F2421',
                      backgroundColor: 'rgba(219, 234, 254, 0.25)',
                    }}
                    className="w-40 h-28 border-4 rounded shadow-inner relative flex flex-col justify-between p-1 backdrop-blur-xs transition-colors duration-500 ml-auto"
                  >
                    <div className="w-full h-full border border-sky-400/40 flex items-center justify-center relative">
                      {/* Window Hotspot Pin */}
                      <button
                        type="button"
                        onClick={() => setActiveCategory('pintuJendela')}
                        className="bg-black/80 hover:bg-black text-white px-2 py-0.5 rounded text-[8px] font-mono cursor-pointer border border-white/20 shadow-xs"
                      >
                        Kusen: {customSelections.pintuJendela.brand}
                      </button>
                    </div>
                  </div>

                  {/* Living Room Minimal Furniture Silhouette */}
                  <div className="absolute bottom-1 left-8 w-24 h-10 bg-slate-800/20 rounded-t-lg border-t border-l border-r border-slate-700/30 flex items-center justify-center">
                    <span className="text-[9px] text-slate-700 font-mono font-medium">Sofa Minimalis</span>
                  </div>
                </div>

                {/* Floor Plane */}
                <div
                  style={{ backgroundColor: customSelections.lantai.colorHex || '#F5F2EB' }}
                  className="h-20 relative overflow-hidden transition-colors duration-500 border-t-2 border-slate-400/60 shadow-lg flex items-center px-3"
                >
                  {/* Tile Grid lines */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_28px,rgba(0,0,0,0.06)_28px,rgba(0,0,0,0.06)_30px)]" />

                  {/* Floor Hotspot Pin */}
                  <button
                    type="button"
                    onClick={() => setActiveCategory('lantai')}
                    className="relative z-10 flex items-center gap-1 bg-black/75 hover:bg-black text-white px-2.5 py-1 rounded text-[9px] font-mono backdrop-blur-xs transition-all shadow-md cursor-pointer border border-white/20"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Lantai: {customSelections.lantai.brand} ({customSelections.lantai.name})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bathroom Room Perspective: Focus on Kloset & Wastafel & Tile */}
            {activeRoom === 'bathroom' && (
              <div className="absolute inset-0 flex flex-col bg-slate-100">
                {/* Bathroom Ceiling */}
                <div
                  style={{ backgroundColor: customSelections.plafon.colorHex || '#FFFFFF' }}
                  className="h-16 relative overflow-hidden transition-colors duration-500 border-b border-black/15 shadow-inner"
                >
                  <button
                    type="button"
                    onClick={() => setActiveCategory('plafon')}
                    className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/75 hover:bg-black text-white px-2 py-0.5 rounded text-[8px] font-mono border border-white/20 cursor-pointer"
                  >
                    Plafon: {customSelections.plafon.brand}
                  </button>
                </div>

                {/* Bathroom Wall & Sanitary Fixtures Showcase */}
                <div
                  style={{ backgroundColor: customSelections.dinding.colorHex || '#F1F5F9' }}
                  className="flex-1 relative flex items-center justify-around px-4 transition-colors duration-500 border-y border-black/10"
                >
                  {/* Vanity Counter with Wastafel Meja */}
                  <div className="bg-white/95 rounded-lg border border-slate-300 p-2.5 shadow-md w-36 space-y-1 relative group hover:border-[#006948] transition-colors">
                    <div className="text-[8px] font-mono text-slate-500 uppercase font-semibold">
                      WASTAFEL & KRAN MEJA
                    </div>
                    {/* Mirror & Vessel Sink Illustration */}
                    <div className="h-10 bg-sky-50 border border-sky-200 rounded flex items-center justify-center relative overflow-hidden">
                      <div className="w-12 h-6 rounded-b-xl border-2 border-slate-700 bg-white flex items-center justify-center shadow-xs">
                        <span className="text-[8px] font-mono font-bold text-slate-800">
                          {customSelections.wastafel.brand}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveCategory('wastafel')}
                      className="w-full text-center bg-[#006948] text-white text-[9px] font-mono py-0.5 rounded cursor-pointer hover:bg-[#005137] transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Ubah Wastafel</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* Kloset Duduk Showcase */}
                  <div className="bg-white/95 rounded-lg border border-slate-300 p-2.5 shadow-md w-36 space-y-1 relative group hover:border-[#006948] transition-colors">
                    <div className="text-[8px] font-mono text-slate-500 uppercase font-semibold">
                      KLOSET DUDUK SANITARI
                    </div>
                    {/* Toilet Bowl Illustration */}
                    <div className="h-10 bg-slate-50 border border-slate-200 rounded flex items-center justify-center relative">
                      <div className="w-10 h-7 rounded-t-lg rounded-b-2xl border-2 border-slate-700 bg-white flex flex-col items-center justify-center shadow-xs">
                        <span className="text-[8px] font-bold text-[#006948] font-mono leading-none">
                          {customSelections.kloset.brand}
                        </span>
                        <span className="text-[6px] text-slate-500 font-mono mt-0.5">Dual Flush</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveCategory('kloset')}
                      className="w-full text-center bg-[#006948] text-white text-[9px] font-mono py-0.5 rounded cursor-pointer hover:bg-[#005137] transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Ubah Kloset</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* Bathroom Tile Floor */}
                <div
                  style={{ backgroundColor: customSelections.lantai.colorHex || '#F5F2EB' }}
                  className="h-18 relative overflow-hidden transition-colors duration-500 border-t-2 border-slate-400/60 shadow-lg flex items-center px-3"
                >
                  <button
                    type="button"
                    onClick={() => setActiveCategory('lantai')}
                    className="relative z-10 flex items-center gap-1 bg-black/75 hover:bg-black text-white px-2.5 py-1 rounded text-[9px] font-mono backdrop-blur-xs transition-all shadow-md cursor-pointer border border-white/20"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Lantai Kamar Mandi: {customSelections.lantai.brand}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bedroom Room Perspective: Focus on Acoustic ceiling, cozy wall, window, flooring */}
            {activeRoom === 'bedroom' && (
              <div className="absolute inset-0 flex flex-col">
                <div
                  style={{ backgroundColor: customSelections.plafon.colorHex || '#FFFFFF' }}
                  className="h-20 relative overflow-hidden transition-colors duration-500 border-b border-black/15 shadow-inner"
                >
                  <button
                    type="button"
                    onClick={() => setActiveCategory('plafon')}
                    className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/75 hover:bg-black text-white px-2 py-0.5 rounded text-[8px] font-mono border border-white/20 cursor-pointer"
                  >
                    Plafon Kamar: {customSelections.plafon.brand}
                  </button>
                </div>

                <div
                  style={{ backgroundColor: customSelections.dinding.colorHex || '#FAF9F6' }}
                  className="flex-1 relative flex items-center justify-between px-6 transition-colors duration-500 border-y border-black/10"
                >
                  {/* Bed Headboard Graphic */}
                  <div className="w-36 h-20 bg-slate-800/15 border-t-4 border-slate-600/40 rounded-t-md flex items-end justify-center pb-2">
                    <span className="text-[8px] font-mono text-slate-600 font-bold bg-white/80 px-2 py-0.5 rounded">
                      Master King Bed
                    </span>
                  </div>

                  {/* Window */}
                  <div
                    style={{
                      borderColor: customSelections.pintuJendela.colorHex || '#1F2421',
                      backgroundColor: 'rgba(219, 234, 254, 0.25)',
                    }}
                    className="w-32 h-24 border-4 rounded shadow-inner flex items-center justify-center p-1"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveCategory('pintuJendela')}
                      className="bg-black/80 hover:bg-black text-white px-1.5 py-0.5 rounded text-[8px] font-mono cursor-pointer border border-white/20"
                    >
                      {customSelections.pintuJendela.brand}
                    </button>
                  </div>
                </div>

                <div
                  style={{ backgroundColor: customSelections.lantai.colorHex || '#F5F2EB' }}
                  className="h-20 relative overflow-hidden transition-colors duration-500 border-t-2 border-slate-400/60 shadow-lg flex items-center px-3"
                >
                  <button
                    type="button"
                    onClick={() => setActiveCategory('lantai')}
                    className="relative z-10 flex items-center gap-1 bg-black/75 hover:bg-black text-white px-2.5 py-1 rounded text-[9px] font-mono backdrop-blur-xs cursor-pointer border border-white/20"
                  >
                    <span>Lantai: {customSelections.lantai.brand} ({customSelections.lantai.colorName})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Facade Perspective: Exterior Weathercoat wall, modern overhang roof, front window */}
            {activeRoom === 'facade' && (
              <div className="absolute inset-0 flex flex-col bg-sky-900/10">
                {/* Tropical Overhang & Sky */}
                <div
                  style={{ backgroundColor: customSelections.plafon.colorHex || '#FFFFFF' }}
                  className="h-16 relative overflow-hidden transition-colors duration-500 border-b-2 border-amber-900/30 shadow-inner flex items-center px-3"
                >
                  <span className="text-[9px] font-mono font-bold text-slate-800 bg-white/80 px-2 py-0.5 rounded border border-slate-300">
                    Overhang Plafon: {customSelections.plafon.brand}
                  </span>
                </div>

                {/* Exterior Wall & Main Architectural Entrance Door */}
                <div
                  style={{ backgroundColor: customSelections.dinding.colorHex || '#FAF9F6' }}
                  className="flex-1 relative flex items-center justify-around px-4 transition-colors duration-500 border-y border-black/10"
                >
                  <button
                    type="button"
                    onClick={() => setActiveCategory('dinding')}
                    className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/80 hover:bg-black text-white px-2 py-0.5 rounded text-[8px] font-mono border border-white/20 cursor-pointer"
                  >
                    Cat Eksterior: {customSelections.dinding.brand} ({customSelections.dinding.colorName?.split(' ')[0]})
                  </button>

                  {/* Main Entry Door & Architectural Sidelight */}
                  <div
                    style={{
                      borderColor: customSelections.pintuJendela.colorHex || '#1F2421',
                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    }}
                    className="w-44 h-26 border-4 rounded shadow-md flex items-center justify-around p-1.5"
                  >
                    <div className="h-full w-20 bg-amber-950/20 border-r-2 border-slate-700/50 flex items-center justify-center">
                      <span className="text-[7px] font-mono font-bold text-slate-800 bg-white/90 px-1 py-0.5 rounded">
                        Pintu Utama
                      </span>
                    </div>
                    <div className="h-full w-20 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setActiveCategory('pintuJendela')}
                        className="bg-black/80 hover:bg-black text-white px-1.5 py-0.5 rounded text-[8px] font-mono cursor-pointer"
                      >
                        {customSelections.pintuJendela.brand}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Porch / Terrace Floor */}
                <div
                  style={{ backgroundColor: customSelections.lantai.colorHex || '#F5F2EB' }}
                  className="h-20 relative overflow-hidden transition-colors duration-500 border-t-2 border-slate-400/60 shadow-lg flex items-center px-3"
                >
                  <button
                    type="button"
                    onClick={() => setActiveCategory('lantai')}
                    className="relative z-10 flex items-center gap-1 bg-black/75 hover:bg-black text-white px-2.5 py-1 rounded text-[9px] font-mono backdrop-blur-xs cursor-pointer border border-white/20"
                  >
                    <span>Lantai Teras Depan: {customSelections.lantai.brand}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Specifications of Currently Selected 6 Components */}
          <div className="bg-[#f8fafc] border border-slate-200 rounded p-3 space-y-2 text-xs">
            <div className="font-bold font-mono text-[11px] uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>KOMPONEN TERPASANG ({MATERIAL_CATEGORIES.length})</span>
              <span className="text-[#006948] font-mono font-bold">Variabel RAB Aktif</span>
            </div>

            <div className="divide-y divide-slate-100 text-[11px]">
              {MATERIAL_CATEGORIES.map((cat) => {
                const item = customSelections[cat.id];
                const isActive = activeCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`py-1.5 flex items-center justify-between cursor-pointer px-1.5 rounded transition-colors group ${
                      isActive ? 'bg-emerald-50 text-[#006948] font-semibold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      <span>{cat.icon}</span>
                      <span className="text-slate-500">{cat.label}:</span>
                      <strong className="truncate">{item.brand} ({item.name})</strong>
                    </div>
                    <span className="font-mono text-slate-700 shrink-0 text-[10px]">
                      {item.priceDelta === 0 ? 'Std' : `+Rp ${(item.priceDelta / 1000000).toFixed(1)}Jt`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget Impact Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Estimasi Dasar Fisik ({blueprint.buildingArea}m²):</span>
              <span className="font-mono font-bold text-slate-800">Rp 650.000.000</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#006948] font-semibold">Selisih Variabel Finishing:</span>
              <span className="font-mono font-bold text-[#006948]">
                {rabData.finishCostDelta >= 0 ? '+' : ''}{formatIDR(rabData.finishCostDelta)}
              </span>
            </div>

            <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block font-semibold">
                  ESTIMASI TOTAL ANGGARAN FISIK (RAB):
                </span>
                <span className="text-base font-extrabold font-mono text-slate-900">
                  {formatIDR(updatedTotalPhysicalCost)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleDownloadSpecSheet}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-emerald-300 text-[#006948] rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                title="Unduh RKS & Rincian Variabel RAB"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadSuccess ? 'Tersimpan!' : 'Unduh RAB BoQ'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Dual Mode Switcher between Catalog & Variable RAB Table */}
        <div className="lg:col-span-7 space-y-4">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveViewMode('catalog')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeViewMode === 'catalog'
                    ? 'bg-[#006948] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>PILIHAN MATERIAL & BRAND</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveViewMode('rabTable')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeViewMode === 'rabTable'
                    ? 'bg-[#006948] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>TABEL VARIABEL RAB (BoQ)</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              SNI 1726:2019 & AHS 2024
            </span>
          </div>

          {/* VIEW MODE 1: Catalog & Component Customizer */}
          {activeViewMode === 'catalog' && (
            <div className="space-y-4">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
                {MATERIAL_CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const selectedItem = customSelections[cat.id];
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-2 rounded text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isActive
                          ? 'bg-[#006948] border-[#006948] text-white shadow-xs'
                          : 'bg-[#f8fafc] border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                      {selectedItem.priceDelta > 0 && (
                        <span className={`text-[10px] font-mono ${isActive ? 'text-emerald-100' : 'text-[#006948]'}`}>
                          •
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Category Info Banner */}
              <div className="bg-[#f8fafc] p-3 rounded border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{activeCategoryData.label}</span>
                  <span className="text-slate-400 mx-1.5">·</span>
                  <span className="text-slate-600">{activeCategoryData.description}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Brand Aktif: <strong className="text-slate-800">{customSelections[activeCategory].brand}</strong>
                </span>
              </div>

              {/* Options List */}
              <div className="space-y-3">
                {currentOptions.map((opt) => {
                  const isSelected = customSelections[activeCategory].id === opt.id;
                  const formattedItemDelta =
                    opt.priceDelta === 0
                      ? 'Termasuk Standar DED'
                      : opt.priceDelta > 0
                      ? `+ Rp ${(opt.priceDelta / 1000000).toFixed(1).replace('.', ',')} Jt`
                      : `- Rp ${(Math.abs(opt.priceDelta) / 1000000).toFixed(1).replace('.', ',')} Jt`;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => onUpdateSelection(activeCategory, opt)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#006948] bg-emerald-50/40 ring-1 ring-[#006948] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      {/* Left Specs */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-slate-900">{opt.brand}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs font-semibold text-slate-700">{opt.name}</span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              opt.grade === 'Luxury'
                                ? 'bg-purple-100 text-purple-800'
                                : opt.grade === 'Premium'
                                ? 'bg-emerald-100 text-[#006948]'
                                : opt.grade === 'Menengah'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {opt.grade}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-snug">{opt.spec}</p>

                        {/* Color / Variant & Bullet points */}
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          {opt.colorName && (
                            <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-mono text-slate-700">
                              {opt.colorHex && (
                                <span
                                  style={{ backgroundColor: opt.colorHex }}
                                  className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                                />
                              )}
                              <span>Warna: {opt.colorName}</span>
                            </div>
                          )}

                          {opt.features.map((feat, idx) => (
                            <span key={idx} className="text-[10px] text-slate-500 flex items-center gap-1">
                              <span className="text-[#006948]">✓</span> {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Price & Select Button */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div
                          className={`text-xs font-bold font-mono ${
                            opt.priceDelta > 0
                              ? 'text-[#006948]'
                              : opt.priceDelta < 0
                              ? 'text-sky-700'
                              : 'text-slate-500'
                          }`}
                        >
                          {formattedItemDelta}
                        </div>

                        <div className="mt-1">
                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006948] bg-emerald-100 px-2.5 py-1 rounded">
                              <Check className="w-3.5 h-3.5" />
                              <span>Terpilih</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 hover:border-slate-400 px-3 py-1 rounded transition-colors"
                            >
                              Terapkan
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW MODE 2: TABEL VARIABEL RAB (BoQ Bill of Quantities) */}
          {activeViewMode === 'rabTable' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-xs text-slate-700 flex items-start gap-2">
                <Info className="w-4 h-4 text-[#006948] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#006948]">Kalkulasi Variabel RAB Real-Time:</div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Formula: <strong className="font-mono">Subtotal = Volume (m²/Unit) × [Harga Satuan Bahan + Upah Pasang Satuan]</strong>.
                    Setiap pergantian spesifikasi material di panel kiri langsung memperbarui angka variabel pada lembar BoQ proyek ini.
                  </p>
                </div>
              </div>

              {/* Itemized BoQ Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-mono text-[11px] border-b border-slate-200">
                      <th className="p-2.5 font-bold">KODE AHS</th>
                      <th className="p-2.5 font-bold">URAIAN PEKERJAAN & BRAND</th>
                      <th className="p-2.5 font-bold text-center">VOLUME</th>
                      <th className="p-2.5 font-bold text-right">HARGA BAHAN</th>
                      <th className="p-2.5 font-bold text-right">UPAH PASANG</th>
                      <th className="p-2.5 font-bold text-right">SUBTOTAL BIAYA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {rabData.items.map((item) => (
                      <tr key={item.code} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2.5 font-mono text-slate-500 font-medium whitespace-nowrap">
                          {item.code}
                        </td>
                        <td className="p-2.5">
                          <div className="font-bold text-slate-900">{item.categoryLabel}</div>
                          <div className="text-[10px] text-[#006948] font-mono">
                            {item.brand} — {item.componentName}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[260px]">
                            {item.spec}
                          </div>
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-slate-800 whitespace-nowrap">
                          {item.volume} {item.unit}
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-700 whitespace-nowrap">
                          {formatIDR(item.unitPrice)}
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-500 whitespace-nowrap">
                          {formatIDR(item.laborPrice)}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap bg-emerald-50/30">
                          {formatIDR(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 border-t-2 border-slate-300 font-bold text-xs">
                      <td colSpan={5} className="p-2.5 text-right text-slate-700 font-mono uppercase">
                        TOTAL VARIABEL FINISHING KUSTOMISASI:
                      </td>
                      <td className="p-2.5 text-right font-mono text-sm text-[#006948]">
                        {formatIDR(rabData.totalVariableFinishing)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Comparison vs Standard Baseline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">
                    Acuan Standar Finishing DED:
                  </span>
                  <span className="font-mono font-bold text-slate-700 text-sm">
                    Rp 78.600.000
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">
                    Finishing Kustomisasi Terpilih:
                  </span>
                  <span className="font-mono font-bold text-[#006948] text-sm">
                    {formatIDR(rabData.totalVariableFinishing)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">
                    Variasi Terhadap Anggaran:
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {rabData.finishCostDelta >= 0 ? '+' : ''}{formatIDR(rabData.finishCostDelta)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Trigger to Lock and Purchase */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              Kustomisasi Anda dan variabel RAB ini otomatis dicantumkan ke dalam <strong>Lampiran BoQ Excel DED</strong>.
            </div>

            <button
              type="button"
              onClick={onOpenCheckoutWithCustomSpecs}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#006948] hover:bg-[#005137] text-white text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <span>🛒 Beli Paket DED dengan Kustomisasi Ini</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
