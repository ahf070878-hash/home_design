import { X, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onTogglePackage: (index: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onTogglePackage,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const total = items.reduce((acc, curr) => acc + curr.price, 0);

  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(total);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl relative border-l border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#006948]" />
            <h3 className="font-bold text-slate-900 text-base">Keranjang Lisensi ({items.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 cad-scrollbar">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Keranjang Masih Kosong</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Pilih desain cetak biru siap bangun dari katalog untuk memulai pembelian berkas kerja resmi.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-[#006948] text-white text-xs font-semibold rounded cursor-pointer"
              >
                Jelajahi Katalog Arsitek
              </button>
            </div>
          ) : (
            items.map((item, index) => {
              const formattedItemPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(item.price);

              return (
                <div
                  key={`${item.blueprint.id}-${index}`}
                  className="p-3.5 border border-slate-200 rounded space-y-2.5 bg-[#f8fafc]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <img
                      src={item.blueprint.mainImage}
                      alt={item.blueprint.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-12 object-cover rounded shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 truncate">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {item.blueprint.title}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Kode: {item.blueprint.code} · {item.blueprint.architect.name}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Package Selector */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                    <button
                      onClick={() => onTogglePackage(index)}
                      className="text-left cursor-pointer group"
                    >
                      <span className="text-slate-500 text-[10px] uppercase font-mono block">
                        PAKET DIPILIH:
                      </span>
                      <span className="font-semibold text-slate-800 group-hover:text-[#006948] underline decoration-dotted text-xs">
                        {item.packageType === 'standard' ? 'Paket Standar DED' : 'DED + Konsultasi Video'}
                      </span>
                    </button>

                    <span className="font-bold font-mono text-[#006948] text-sm">
                      {formattedItemPrice}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>TOTAL DOKUMEN:</span>
              <span className="text-slate-900 font-bold">{items.length} Lisensi DED</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-900">Total Pembayaran:</span>
              <span className="text-xl font-bold font-mono text-[#006948]">{formattedTotal}</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-[#006948] shrink-0" />
              <span>Garansi 100% Legal & SIMBG Teruji Nasional</span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-3 bg-[#006948] hover:bg-[#005137] text-white font-semibold text-xs sm:text-sm rounded flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
