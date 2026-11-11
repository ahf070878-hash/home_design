import { X, Bookmark, ArrowRight, Trash2 } from 'lucide-react';
import { BlueprintDesign } from '../types';

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedIds: string[];
  blueprints: BlueprintDesign[];
  onSelectBlueprint: (bp: BlueprintDesign) => void;
  onToggleSave: (id: string) => void;
}

export default function SavedModal({
  isOpen,
  onClose,
  savedIds,
  blueprints,
  onSelectBlueprint,
  onToggleSave,
}: SavedModalProps) {
  if (!isOpen) return null;

  const savedItems = blueprints.filter((b) => savedIds.includes(b.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden relative">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#006948]" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Desain yang Anda Simpan ({savedItems.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-3 cad-scrollbar">
          {savedItems.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Bookmark className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p>Belum ada desain yang disimpan.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Klik ikon bookmark pada kartu desain untuk menyimpan referensi.
              </p>
            </div>
          ) : (
            savedItems.map((bp) => (
              <div
                key={bp.id}
                className="p-3 border border-slate-200 rounded hover:border-slate-300 transition-colors flex items-center gap-3 bg-[#f8fafc]"
              >
                <img
                  src={bp.mainImage}
                  alt={bp.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-12 object-cover rounded shrink-0"
                />
                <div className="flex-1 truncate">
                  <h4
                    onClick={() => {
                      onSelectBlueprint(bp);
                      onClose();
                    }}
                    className="font-bold text-slate-900 text-xs hover:text-[#006948] cursor-pointer truncate"
                  >
                    {bp.title}
                  </h4>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Lahan {bp.minLandWidth}x{bp.minLandLength}m · {bp.featureHighlight}
                  </div>
                  <div className="text-xs font-bold font-mono text-[#006948]">
                    Rp {(bp.priceDED / 1000000).toFixed(1).replace('.', ',')} Jt
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onSelectBlueprint(bp);
                      onClose();
                    }}
                    className="p-1.5 bg-[#006948] hover:bg-[#005137] text-white rounded text-xs"
                    title="Lihat"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onToggleSave(bp.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
