"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Check, Copy, ExternalLink, FileImage, Film, LoaderCircle, Pencil, Save, Trash2, Upload, X } from "lucide-react";
import styles from "./admin-console.module.css";

type MediaAsset = {
  fileName: string;
  displayName: string;
  url: string;
  kind: "image" | "video";
  size: number;
  modifiedAt: string;
};

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("Memuat pustaka aset…");
  const [copiedUrl, setCopiedUrl] = useState("");
  const [editingFileName, setEditingFileName] = useState("");
  const [draftName, setDraftName] = useState("");
  const [savingFileName, setSavingFileName] = useState("");
  const [deletingFileName, setDeletingFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/media", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<{ assets: MediaAsset[] }>;
      })
      .then(({ assets: value }) => { setAssets(value); setMessage(value.length ? `${value.length} media tersedia.` : "Belum ada media. Upload file pertama Anda."); })
      .catch(() => setMessage("Pustaka aset gagal dimuat."))
      .finally(() => setLoading(false));
  }, []);

  async function uploadFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) { setMessage("Pilih file sebelum meng-upload."); return; }
    setUploading(true);
    setMessage("Meng-upload media…");
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/media", {
      method: "POST",
      headers: token ? { "x-settings-token": token } : undefined,
      body,
    });
    const payload = await response.json() as { asset?: MediaAsset; error?: string };
    if (!response.ok || !payload.asset) {
      setMessage(payload.error ?? "Media gagal di-upload.");
      setUploading(false);
      return;
    }
    setAssets((current) => [payload.asset!, ...current]);
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    setUploading(false);
    setMessage("Media berhasil di-upload dan siap digunakan.");
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setMessage("URL media disalin. Tempelkan pada pengaturan konten yang diperlukan.");
    window.setTimeout(() => setCopiedUrl(""), 1800);
  }

  function startEditing(asset: MediaAsset) {
    setEditingFileName(asset.fileName);
    setDraftName(asset.displayName);
    setMessage(`Mengedit nama “${asset.displayName}”.`);
  }

  function cancelEditing() {
    setEditingFileName("");
    setDraftName("");
    setMessage(`${assets.length} media tersedia.`);
  }

  async function saveEdit(asset: MediaAsset) {
    const displayName = draftName.trim();
    if (!displayName) { setMessage("Nama media wajib diisi."); return; }
    setSavingFileName(asset.fileName);
    const response = await fetch("/api/admin/media", {
      method: "PATCH",
      headers: { "content-type": "application/json", ...(token ? { "x-settings-token": token } : {}) },
      body: JSON.stringify({ fileName: asset.fileName, displayName }),
    });
    const payload = await response.json() as { asset?: MediaAsset; error?: string };
    if (!response.ok || !payload.asset) {
      setMessage(payload.error ?? "Nama media gagal diperbarui.");
      setSavingFileName("");
      return;
    }
    setAssets((current) => current.map((item) => item.fileName === asset.fileName ? payload.asset! : item));
    setEditingFileName("");
    setDraftName("");
    setSavingFileName("");
    setMessage("Nama media berhasil diperbarui tanpa mengubah URL file.");
  }

  async function deleteAsset(asset: MediaAsset) {
    if (!window.confirm(`Hapus “${asset.displayName}” secara permanen dari Pustaka Aset?`)) return;
    setDeletingFileName(asset.fileName);
    setMessage(`Menghapus “${asset.displayName}”…`);
    const response = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "content-type": "application/json", ...(token ? { "x-settings-token": token } : {}) },
      body: JSON.stringify({ fileName: asset.fileName }),
    });
    const payload = await response.json() as { deleted?: boolean; error?: string };
    if (!response.ok || !payload.deleted) {
      setMessage(payload.error ?? "Media gagal dihapus.");
      setDeletingFileName("");
      return;
    }
    setAssets((current) => current.filter((item) => item.fileName !== asset.fileName));
    if (editingFileName === asset.fileName) { setEditingFileName(""); setDraftName(""); }
    setDeletingFileName("");
    setMessage("Media berhasil dihapus dari pustaka.");
  }

  return <div className={styles.mediaWorkspace}>
    <form className={styles.uploadPanel} onSubmit={uploadFile}>
      <div className={styles.cardHeader}>
        <h2>Upload aset umum</h2>
        <p>Untuk hero, poster, atau konten umum. Paket gambar arsitektur diunggah dari Produk &amp; desain.</p>
      </div>
      <label className={styles.filePicker} htmlFor="media-file">
        <Upload size={24}/>
        <span>{file ? file.name : "Pilih gambar atau video"}</span>
        <small>{file ? formatSize(file.size) : "JPG, PNG, WebP, AVIF, GIF, MP4, WebM, atau MOV"}</small>
      </label>
      <input ref={inputRef} className={styles.visuallyHiddenInput} id="media-file" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm,video/quicktime" onChange={(event) => setFile(event.target.files?.[0] ?? null)}/>
      <div className={styles.field}>
        <label htmlFor="media-token">Token admin produksi</label>
        <input id="media-token" type="password" value={token} onChange={(event) => setToken(event.target.value)} autoComplete="off" placeholder="Kosongkan untuk pengembangan lokal"/>
        <small>Di produksi, isi sesuai <code>SETTINGS_ADMIN_TOKEN</code>.</small>
      </div>
      <button className={styles.primaryButton} type="submit" disabled={!file || uploading}>
        {uploading ? <LoaderCircle className={styles.spin} size={17}/> : <Upload size={17}/>}
        {uploading ? "Meng-upload…" : "Upload ke Pustaka Aset"}
      </button>
      <p className={styles.status} role="status">{message}</p>
    </form>

    <section className={styles.libraryPanel} aria-busy={loading}>
      <div className={styles.libraryHeader}>
        <div><h2>Aset tersedia</h2><p>{assets.length} file dalam penyimpanan lokal</p></div>
      </div>
      {loading ? <div className={styles.mediaEmpty}><LoaderCircle className={styles.spin} size={24}/><p>Memuat media…</p></div> : assets.length === 0 ? <div className={styles.mediaEmpty}><FileImage size={28}/><p>Belum ada file di pustaka.</p></div> : <div className={styles.mediaList}>
        {assets.map((asset) => <article className={styles.mediaListItem} key={asset.url}>
          <a className={styles.mediaThumbnail} href={asset.url} target="_blank" rel="noreferrer" aria-label={`Review ${asset.displayName}`} title="Buka file untuk review">
            {asset.kind === "image" ? <img src={asset.url} alt=""/> : <video src={asset.url} muted preload="metadata"/>}
            <span><ExternalLink size={13}/> Review</span>
          </a>
          <div className={styles.mediaDetails}>
            <span>{asset.kind === "image" ? <FileImage size={15}/> : <Film size={15}/>} {asset.kind === "image" ? "Gambar" : "Video"} · {formatSize(asset.size)}</span>
            {editingFileName === asset.fileName ? <input aria-label={`Nama tampilan ${asset.fileName}`} autoFocus maxLength={120} value={draftName} onChange={(event) => setDraftName(event.target.value)} onKeyDown={(event) => {
              if (event.key === "Enter") void saveEdit(asset);
              if (event.key === "Escape") cancelEditing();
            }}/> : <strong title={asset.displayName}>{asset.displayName}</strong>}
            <code title={asset.url}>{asset.url}</code>
          </div>
          <div className={styles.mediaActions}>
            <button className={styles.compactButton} type="button" onClick={() => copyUrl(asset.url)} title="Salin URL media">
              {copiedUrl === asset.url ? <Check size={15}/> : <Copy size={15}/>}<span>{copiedUrl === asset.url ? "Disalin" : "Salin URL"}</span>
            </button>
            {editingFileName === asset.fileName ? <>
              <button className={styles.compactPrimaryButton} type="button" disabled={savingFileName === asset.fileName} onClick={() => saveEdit(asset)}>
                {savingFileName === asset.fileName ? <LoaderCircle className={styles.spin} size={15}/> : <Save size={15}/>}<span>Simpan</span>
              </button>
              <button className={styles.compactButton} type="button" disabled={savingFileName === asset.fileName} onClick={cancelEditing}><X size={15}/><span>Batal</span></button>
            </> : <>
              <button className={styles.compactButton} type="button" onClick={() => startEditing(asset)}><Pencil size={15}/><span>Edit</span></button>
              <button className={styles.compactDangerButton} type="button" disabled={deletingFileName === asset.fileName} onClick={() => deleteAsset(asset)}>
                {deletingFileName === asset.fileName ? <LoaderCircle className={styles.spin} size={15}/> : <Trash2 size={15}/>}<span>Hapus</span>
              </button>
            </>}
          </div>
        </article>)}
      </div>}
    </section>
  </div>;
}
