import { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Code2,
  Terminal,
  FolderArchive,
  Github,
  ExternalLink,
  FileText,
  FileCode,
  Layers,
  Sparkles,
} from 'lucide-react';
import { BLUEPRINT_DESIGNS } from '../data/mockData';
import { MATERIAL_CATEGORIES, DEFAULT_MATERIAL_SELECTIONS } from '../data/materialsData';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CodeExportModal({ isOpen, onClose }: CodeExportModalProps) {
  const [activeTab, setActiveTab] = useState<'download' | 'github' | 'files' | 'data'>('download');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('package.json');

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadDatasetJson = () => {
    const data = {
      platform: 'HuniBangun.id',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      blueprints: BLUEPRINT_DESIGNS,
      materials: {
        categories: MATERIAL_CATEGORIES,
        defaults: DEFAULT_MATERIAL_SELECTIONS,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hunibangun-dataset-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const codeSnippets: Record<string, { label: string; code: string; lang: string }> = {
    'package.json': {
      label: 'package.json (Dependencies & Scripts)',
      lang: 'json',
      code: `{
  "name": "hunibangun-id",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@vitejs/plugin-react": "^6.1.1",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^8.3.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "tailwindcss": "^4.3.3",
    "tsx": "^4.21.0",
    "typescript": "^7.0.2"
  }
}`,
    },
    'vite.config.ts': {
      label: 'vite.config.ts (Vite + Tailwind v4 Setup)',
      lang: 'typescript',
      code: `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});`,
    },
    'setup.sh': {
      label: 'setup.sh (Quickstart Terminal Commands)',
      lang: 'bash',
      code: `# 1. Ekstrak atau Kloning Repositori
git clone https://github.com/your-username/hunibangun-id.git
cd hunibangun-id

# 2. Pasang Semua Dependencies (Node.js 18+)
npm install

# 3. Jalankan Server Development Lokal
npm run dev

# 4. Bangun untuk Produksi (Output di folder /dist)
npm run build`,
    },
    '.env.example': {
      label: '.env.example (Environment Variables)',
      lang: 'env',
      code: `# Environment Variables untuk HuniBangun.id
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="http://localhost:3000"`,
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#006948] text-white flex items-center justify-center font-bold shadow-xs">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Pusat Ekspor Kode & Data Proyek (Code Export)
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-400/30">
                  READY TO EXPORT
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Unduh source code lengkap, dataset JSON arsitektur, panduan GitHub, dan konfigurasi lokal.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0 overflow-x-auto gap-2">
          {[
            { id: 'download', label: 'Unduh Source Code (.ZIP)', icon: FolderArchive },
            { id: 'github', label: 'Panduan Ekspor GitHub & AI Studio', icon: Github },
            { id: 'data', label: 'Ekspor Dataset Blueprint (JSON)', icon: Layers },
            { id: 'files', label: 'Inspektur File & Konfigurasi', icon: FileCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#006948] text-[#006948] bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 cad-scrollbar">
          {/* TAB 1: DOWNLOAD ZIP */}
          {activeTab === 'download' && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                <div className="p-2 bg-[#006948] text-white rounded-lg shrink-0 mt-0.5">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Arsip Source Code Siap Pakai
                  </h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    Arsip ZIP berisi seluruh kode aplikasi frontend (React 19 + TypeScript + Tailwind v4 + Lucide React + data mock arsitektur + komponen kalkulator material). Anda dapat langsung mengekstraknya dan menjalankan <code className="font-mono bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded">npm install && npm run dev</code>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lightweight ZIP */}
                <div className="border-2 border-[#006948] bg-white rounded-xl p-5 shadow-xs relative flex flex-col justify-between">
                  <div className="absolute top-3 right-3 bg-[#006948] text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                    DIREKOMENDASIKAN
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                      <FolderArchive className="w-5 h-5 text-[#006948]" />
                      <span>hunibangun-code-only.zip</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      Ukuran: ~100 KB · Unduh Instan (&lt;1 detik)
                    </div>
                    <p className="text-xs text-slate-600 mt-3">
                      Paket murni source code, komponen React, dataset TypeScript, konfigurasi Vite, Tailwind CSS v4, dan panduan lengkap. Sangat ringan tanpa file media video besar.
                    </p>
                  </div>

                  <a
                    href="/hunibangun-code-only.zip"
                    download="hunibangun-code-only.zip"
                    className="mt-5 w-full py-2.5 px-4 bg-[#006948] hover:bg-[#005137] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Source Code Ringan (.ZIP)</span>
                  </a>
                </div>

                {/* Full ZIP with Assets */}
                <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                      <FolderArchive className="w-5 h-5 text-slate-600" />
                      <span>hunibangun-source-code.zip</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      Ukuran: ~21 MB · Termasuk Media Asset
                    </div>
                    <p className="text-xs text-slate-600 mt-3">
                      Paket komprehensif termasuk source code lengkap beserta aset video simulasi arsitektur di folder <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">public/assets</code>.
                    </p>
                  </div>

                  <a
                    href="/hunibangun-source-code.zip"
                    download="hunibangun-source-code.zip"
                    className="mt-5 w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Paket Penuh + Media (.ZIP)</span>
                  </a>
                </div>
              </div>

              {/* Terminal instructions */}
              <div className="bg-slate-900 text-slate-100 rounded-xl p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-slate-200">Menjalankan Proyek Setelah Diekstrak:</span>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy('unzip hunibangun-code-only.zip\ncd hunibangun-id\nnpm install\nnpm run dev', 'terminal-run')
                    }
                    className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'terminal-run' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'terminal-run' ? 'Tersalin' : 'Salin Perintah'}</span>
                  </button>
                </div>
                <pre className="text-emerald-300 leading-relaxed overflow-x-auto">
{`# 1. Ekstrak file zip yang telah diunduh
unzip hunibangun-code-only.zip

# 2. Masuk ke direktori dan pasang dependensi
npm install

# 3. Jalankan server lokal
npm run dev

# Aplikasi langsung aktif di http://localhost:3000 !`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB & AI STUDIO EXPORT */}
          {activeTab === 'github' && (
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                    <Github className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">Ekspor Langsung Melalui AI Studio UI</h4>
                    <p className="text-xs text-slate-300">
                      Anda juga dapat mengekspor langsung ke GitHub atau mengunduh arsip resmi via platform toolbar.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-lg border border-white/10 space-y-1.5">
                    <div className="text-[11px] font-mono font-bold text-emerald-400">LANGKAH 1</div>
                    <div className="font-semibold text-xs text-white">Buka Toolbar Atas</div>
                    <p className="text-[11px] text-slate-300">
                      Di pojok kanan atas layar AI Studio Build, perhatikan tombol <strong className="text-white">Export / Share</strong>.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-lg border border-white/10 space-y-1.5">
                    <div className="text-[11px] font-mono font-bold text-emerald-400">LANGKAH 2</div>
                    <div className="font-semibold text-xs text-white">Pilih GitHub atau ZIP</div>
                    <p className="text-[11px] text-slate-300">
                      Klik <strong>Export to GitHub</strong> untuk membuat repo baru di akun GitHub Anda, atau klik <strong>Download ZIP</strong>.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-lg border border-white/10 space-y-1.5">
                    <div className="text-[11px] font-mono font-bold text-emerald-400">LANGKAH 3</div>
                    <div className="font-semibold text-xs text-white">Deploy & Kolaborasi</div>
                    <p className="text-[11px] text-slate-300">
                      Sambungkan repositori GitHub Anda ke Vercel, Netlify, atau Cloud Run untuk continuous deployment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Push manual via Git instructions */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#006948]" />
                    <span>Inisialisasi & Push ke GitHub dari Komputer Lokal</span>
                  </h4>
                  <button
                    onClick={() =>
                      handleCopy(
                        'git init\ngit add .\ngit commit -m "feat: initial commit of HuniBangun.id marketplace"\ngit branch -M main\ngit remote add origin https://github.com/USERNAME/hunibangun-id.git\ngit push -u origin main',
                        'git-push'
                      )
                    }
                    className="text-xs text-[#006948] hover:text-[#005137] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'git-push' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'git-push' ? 'Tersalin' : 'Salin Perintah Git'}</span>
                  </button>
                </div>

                <div className="bg-slate-900 rounded-lg p-3.5 text-xs font-mono text-emerald-300 overflow-x-auto">
{`git init
git add .
git commit -m "feat: initial release of HuniBangun.id architectural marketplace"
git branch -M main
git remote add origin https://github.com/USERNAME/hunibangun-id.git
git push -u origin main`}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DATA EXPORT */}
          {activeTab === 'data' && (
            <div className="space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Ekspor Dataset Blueprint & BoQ Material (.JSON)
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Berisi data 6 desain blueprint lengkap (dimensi lahan, KDB, kamar, denah, arsitek STRA) dan katalog opsi material bangunan.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadDatasetJson}
                    className="px-4 py-2 bg-[#006948] hover:bg-[#005137] text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer shrink-0 shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh dataset.json</span>
                  </button>
                </div>

                <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 max-h-72 overflow-y-auto cad-scrollbar">
                  <pre className="text-emerald-300 text-[11px] leading-relaxed">
{JSON.stringify(
  {
    metadata: {
      appName: 'HuniBangun.id',
      version: '1.0.0',
      totalBlueprints: BLUEPRINT_DESIGNS.length,
      categories: ['Tropis Modern', 'Minimalis', 'Japandi', 'Industrial', 'Klasik Kontemporer'],
      standards: ['SNI 03-1726-2019', 'SIMBG PBG Nasional'],
    },
    sampleBlueprint: BLUEPRINT_DESIGNS[0],
  },
  null,
  2
)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FILE INSPECTOR */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {Object.keys(codeSnippets).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFile(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                      selectedFile === key
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-950 text-slate-200 font-mono text-xs">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
                  <span className="text-slate-300 font-bold">{codeSnippets[selectedFile]?.label}</span>
                  <button
                    onClick={() =>
                      handleCopy(codeSnippets[selectedFile]?.code || '', `file-${selectedFile}`)
                    }
                    className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === `file-${selectedFile}` ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedKey === `file-${selectedFile}` ? 'Tersalin' : 'Salin File'}</span>
                  </button>
                </div>

                <div className="p-4 max-h-96 overflow-y-auto cad-scrollbar">
                  <pre className="text-emerald-300 leading-relaxed text-[11px] whitespace-pre-wrap">
                    {codeSnippets[selectedFile]?.code}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs shrink-0">
          <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#006948]" />
            <span>AI Studio Full-Stack SPA · React 19 + TypeScript + Tailwind v4</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
