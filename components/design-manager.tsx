"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, Download, FileImage, LoaderCircle, Save } from "lucide-react";
import styles from "./admin-console.module.css";

type AdminDesign = {
  id: string;
  code: string;
  name: string;
  type: number;
  style: string;
  mainImageUrl: string;
  mediaPackageName: string | null;
  galleryImageUrls: string[];
  isActive: boolean;
};

type MediaAsset = {
  fileName: string;
  displayName: string;
  url: string;
  kind: "image" | "video";
};

export function DesignManager() {
  const [designs, setDesigns] = useState<AdminDesign[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [importing, setImporting] = useState(false);
  const [packageDesignId, setPackageDesignId] = useState("");
  const [packageName, setPackageName] = useState("");
  const [packageFiles, setPackageFiles] = useState<File[]>([]);
  const [uploadingPackage, setUploadingPackage] = useState(false);
  const [message, setMessage] = useState("Memuat produk dan Pustaka Aset…");
  const packageInputRef = useRef<HTMLInputElement>(null);

  async function loadData() {
    return Promise.all([
      fetch("/api/admin/designs", { cache: "no-store" }).then((response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<{ designs: AdminDesign[] }>;
      }),
      fetch("/api/admin/media", { cache: "no-store" }).then((response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<{ assets: MediaAsset[] }>;
      }),
    ])
      .then(([designPayload, mediaPayload]) => {
        setDesigns(designPayload.designs);
        setMedia(mediaPayload.assets.filter((asset) => asset.kind === "image"));
        setSelected(Object.fromEntries(designPayload.designs.map((design) => [design.id, design.mainImageUrl])));
        setPackageDesignId((current) => current || designPayload.designs[0]?.id || "");
        setMessage(`${designPayload.designs.length} desain · ${mediaPayload.assets.filter((asset) => asset.kind === "image").length} gambar tersedia.`);
      })
      .catch(() => setMessage("Produk atau Pustaka Aset gagal dimuat."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    void loadData();
  }, []);

  const mediaByUrl = useMemo(() => new Map(media.map((asset) => [asset.url, asset])), [media]);
  const externalImageCount = designs.filter((design) => design.mainImageUrl.startsWith("http")).length;

  async function importCustomerImages() {
    setImporting(true);
    setMessage("Mengimpor gambar aktif customer ke Pustaka Aset…");
    const response = await fetch("/api/admin/designs/import-media", {
      method: "POST",
      headers: token ? { "x-settings-token": token } : undefined,
    });
    const payload = await response.json() as { importedImages?: number; updatedDesigns?: number; error?: string };
    if (!response.ok) {
      setMessage(payload.error ?? "Gambar customer gagal diimpor.");
      setImporting(false);
      return;
    }
    await loadData();
    setImporting(false);
    setMessage(`${payload.importedImages ?? 0} gambar masuk ke Pustaka Aset dan ${payload.updatedDesigns ?? 0} desain customer diperbarui.`);
  }

  async function saveImage(design: AdminDesign) {
    const mainImageUrl = selected[design.id];
    if (!mediaByUrl.has(mainImageUrl)) { setMessage("Pilih gambar dari Pustaka Aset terlebih dahulu."); return; }
    setSavingId(design.id);
    setMessage(`Menyimpan gambar ${design.code}…`);
    const response = await fetch("/api/admin/designs", {
      method: "PATCH",
      headers: { "content-type": "application/json", ...(token ? { "x-settings-token": token } : {}) },
      body: JSON.stringify({ id: design.id, mainImageUrl }),
    });
    const payload = await response.json() as { design?: AdminDesign; error?: string };
    if (!response.ok || !payload.design) {
      setMessage(payload.error ?? "Gambar desain gagal disimpan.");
      setSavingId("");
      return;
    }
    setDesigns((current) => current.map((item) => item.id === design.id ? payload.design! : item));
    setSavingId("");
    setMessage(`Gambar ${design.code} tersimpan dan menjadi sumber katalog customer.`);
  }

  async function uploadPackage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (packageFiles.length < 1 || packageFiles.length > 20) { setMessage("Pilih 1 sampai 20 gambar untuk satu paket arsitektur."); return; }
    setUploadingPackage(true);
    setMessage("Meng-upload paket arsitektur…");
    const body = new FormData();
    body.append("designId", packageDesignId);
    body.append("packageName", packageName);
    packageFiles.forEach((file) => body.append("files", file));
    const response = await fetch("/api/admin/designs/package", {
      method: "POST",
      headers: token ? { "x-settings-token": token } : undefined,
      body,
    });
    const payload = await response.json() as { design?: AdminDesign; uploadedImages?: number; error?: string };
    if (!response.ok || !payload.design) {
      setMessage(payload.error ?? "Paket arsitektur gagal di-upload.");
      setUploadingPackage(false);
      return;
    }
    await loadData();
    setPackageName("");
    setPackageFiles([]);
    if (packageInputRef.current) packageInputRef.current.value = "";
    setUploadingPackage(false);
    setMessage(`${payload.design.code} menerima paket “${payload.design.mediaPackageName}” berisi ${payload.uploadedImages} gambar. Gambar pertama menjadi cover customer.`);
  }

  return <section className={styles.dataPanel} aria-busy={loading}>
    <div className={styles.productToolbar}>
      <div className={styles.field}>
        <label htmlFor="product-token">Token admin produksi</label>
        <input id="product-token" type="password" value={token} onChange={(event) => setToken(event.target.value)} autoComplete="off" placeholder="Kosongkan untuk pengembangan lokal"/>
      </div>
      <p className={styles.status} role="status">{message}</p>
      {externalImageCount > 0 && <button className={styles.primaryButton} type="button" disabled={importing} onClick={importCustomerImages}>
        {importing ? <LoaderCircle className={styles.spin} size={17}/> : <Download size={17}/>}
        {importing ? "Mengimpor…" : `Impor ${externalImageCount} gambar customer`}
      </button>}
    </div>

    <form className={styles.packageUploader} onSubmit={uploadPackage}>
      <div className={styles.packageHeading}><div><h2>Upload paket arsitektur</h2><p>Satu paket dapat berisi 1–20 gambar. Gambar pertama menjadi cover katalog customer.</p></div><span>{packageFiles.length} gambar</span></div>
      <div className={styles.packageFields}>
        <label><span>Produk desain</span><select value={packageDesignId} onChange={(event) => setPackageDesignId(event.target.value)}>{designs.map((design) => <option value={design.id} key={design.id}>{design.code} · Type {design.type} · {design.name}</option>)}</select></label>
        <label><span>Nama paket</span><input value={packageName} maxLength={80} onChange={(event) => setPackageName(event.target.value)} placeholder="Contoh: Paket Arsitektur Nara 2027"/></label>
        <label className={styles.packageFileField}><span>Pilih gambar sekaligus</span><input ref={packageInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => { const files = Array.from(event.target.files ?? []); setPackageFiles(files); if (files.length > 20) setMessage("Maksimal 20 gambar dalam satu paket."); }}/></label>
      </div>
      {packageFiles.length > 0 && <ol className={styles.packageFileList}>{packageFiles.map((file, index) => <li key={`${file.name}-${index}`}><span>{index + 1}</span>{file.name}{index === 0 && <strong>Cover</strong>}</li>)}</ol>}
      <button className={styles.primaryButton} type="submit" disabled={uploadingPackage || !packageDesignId || !packageName.trim() || packageFiles.length < 1 || packageFiles.length > 20}>
        {uploadingPackage ? <LoaderCircle className={styles.spin} size={17}/> : <FileImage size={17}/>}{uploadingPackage ? "Meng-upload paket…" : "Upload 1 paket"}
      </button>
    </form>

    {loading ? <div className={styles.mediaEmpty}><LoaderCircle className={styles.spin} size={24}/><p>Memuat desain…</p></div> : <>
      {media.length === 0 && <div className={styles.productNotice}><FileImage size={20}/><span>Gambar aktif customer tetap ditampilkan di bawah. Impor gambar tersebut atau <Link href="/media">upload aset umum</Link> ke Pustaka Aset.</span></div>}
      <div className={styles.productList}>
      {designs.map((design) => {
        const selectedUrl = selected[design.id] ?? design.mainImageUrl;
        const changed = selectedUrl !== design.mainImageUrl;
        return <article className={styles.productRow} key={design.id}>
          <div className={styles.productThumbnail}><img src={selectedUrl} alt={`Eksterior ${design.name}`}/></div>
          <div className={styles.productIdentity}>
            <span>{design.code} · Type {design.type}</span>
            <strong>{design.name}</strong>
            <small>{design.style} · {design.isActive ? "Aktif di katalog" : "Tidak aktif"}</small>
            <small>{design.mediaPackageName ? `${design.mediaPackageName} · ${design.galleryImageUrls.length} gambar` : "Belum ada paket arsitektur"}</small>
          </div>
          <label className={styles.productMediaField}>
            <span>Gambar dari Pustaka Aset</span>
            <select disabled={media.length === 0} value={mediaByUrl.has(selectedUrl) ? selectedUrl : ""} onChange={(event) => setSelected((current) => ({ ...current, [design.id]: event.target.value }))}>
              <option value="" disabled>Pilih gambar…</option>
              {media.map((asset) => <option value={asset.url} key={asset.url}>{asset.displayName}</option>)}
            </select>
          </label>
          <button className={changed ? styles.compactPrimaryButton : styles.compactButton} type="button" disabled={!changed || savingId === design.id} onClick={() => saveImage(design)}>
            {savingId === design.id ? <LoaderCircle className={styles.spin} size={15}/> : changed ? <Save size={15}/> : <Check size={15}/>}
            <span>{savingId === design.id ? "Menyimpan" : changed ? "Simpan" : "Tersimpan"}</span>
          </button>
        </article>;
      })}
      </div>
    </>}
  </section>;
}
