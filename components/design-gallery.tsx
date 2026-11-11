"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, Ruler, TriangleAlert } from "lucide-react";
import { cities, fitReason, formatRupiah } from "@/lib/mock-data";
import { useMarketplaceStore } from "@/lib/store";
import { useDesigns } from "@/lib/use-designs";

export function DesignGallery({ compact=false }: { compact?:boolean }) {
  const store = useMarketplaceStore();
  const { designs, loading, error } = useDesigns();
  const [width,setWidth]=useState(store.landWidth); const [length,setLength]=useState(store.landLength); const [city,setCity]=useState(store.city);
  const visible = compact ? designs.slice(0,8) : designs;
  const apply=()=>store.setLand(width,length,city);
  const fitCount=designs.filter(d=>!fitReason(d,store.landWidth,store.landLength)).length;
  return <>
    <div className="land-panel">
      <div className="field"><label htmlFor="width">Lebar lahan (m)</label><input id="width" type="number" min="4" value={width} onChange={e=>setWidth(Number(e.target.value))}/></div>
      <div className="field"><label htmlFor="length">Panjang lahan (m)</label><input id="length" type="number" min="6" value={length} onChange={e=>setLength(Number(e.target.value))}/></div>
      <div className="field"><label htmlFor="city">Kota / kecamatan</label><select id="city" value={city} onChange={e=>setCity(e.target.value)}>{cities.map(c=><option key={c.name}>{c.name}</option>)}</select></div>
      <button className="btn btn-primary" onClick={apply}><Ruler size={18}/> Terapkan lahan</button>
    </div>
    {loading&&<div className="notice">Memuat katalog desain dari database…</div>}
    {error&&<div className="notice"><strong>{error}</strong> Coba muat ulang halaman.</div>}
    {!loading&&!error&&<p className="mono">{fitCount} dari {designs.length} desain muat di lahan {store.landWidth} × {store.landLength} m · {store.city}</p>}
    {!loading&&!error&&fitCount===0&&<div className="notice"><strong>Belum ada yang muat persis.</strong> Type terdekat tetap ditampilkan. Pilih “Adaptasi Custom” untuk mengajukan penyesuaian.</div>}
    <div className="design-grid">{visible.map(d=>{const reason=fitReason(d,store.landWidth,store.landLength);return <article className={`design-card ${reason?"unfit":""}`} key={d.id}>
      <div className="design-media"><Image src={d.image} alt={`Eksterior ${d.name}`} fill sizes="(max-width:768px) 100vw, 25vw"/></div>
      {reason?<span className="badge badge-danger"><TriangleAlert size={13}/>{reason}</span>:<span className="badge badge-success"><Check size={13}/>Muat di lahan</span>}
      <div className="card-meta"><div><h3>Type {d.type} · {d.name}</h3><p>{d.width} × {d.length} m · {d.bedrooms} KT · {d.style}</p></div><strong className="mono">{formatRupiah(d.price)}</strong></div>
      <div className="card-actions"><Link className="btn mini" href="/proses/3" onClick={()=>store.selectDesign(d.id)}>{reason?"Pilih Type Terdekat":"Lihat detail"}</Link>{reason&&<Link className="btn mini btn-warm" href="/proses/3" onClick={()=>{store.selectDesign(d.id);store.setCustomAdaptation(true)}}>Adaptasi Custom</Link>}<button className="btn mini" onClick={()=>store.toggleCompare(d.id)}>Bandingkan {store.compareIds.includes(d.id)?"✓":""}</button></div>
    </article>})}</div>
  </>;
}
