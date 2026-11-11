"use client";

import Link from "next/link";
import { Search, Ticket } from "lucide-react";
import { flowSteps } from "@/lib/mock-data";

export function SiteNav() {
  return <header className="nav"><div className="shell nav-inner">
    <Link className="brand" href="/">HuniBangun<span>.id</span></Link>
    <Link className="search-pill" href="/#katalog"><Search size={17}/><span>Cari type, gaya, atau luas…</span><span className="mono">⌘K</span></Link>
    <nav className="nav-links" aria-label="Navigasi utama"><Link href="/#katalog">Katalog</Link><Link href="/kasir-mitra">Kasir Mitra</Link><Link href="/dasbor-produsen">Produsen</Link><Link className="btn btn-primary" href="/proses/2"><Ticket size={17}/> Mulai</Link></nav>
  </div></header>;
}

export function FlowStrip({ active=1 }: { active?:number }) {
  return <div className="flow-strip"><ol className="shell flow-list">{flowSteps.map((step,index)=><li key={step}><Link href={index===0?"/":`/proses/${index+1}`} aria-current={active===index+1?"step":undefined}><span className="num">{String(index+1).padStart(2,"0")}</span><span>{step}</span></Link></li>)}</ol></div>;
}

export function Footer() { return <footer className="foot"><p className="foot-line">Bangun dari keputusan yang bisa diperiksa.</p><div className="foot-meta"><span className="brand">HuniBangun<span>.id</span></span><span>Demo Phase 1 · Tiket Bangun · 2026</span></div></footer>; }

export function StepRail({ active }: { active:number }) {
  return <aside className="step-rail"><p className="eyebrow">Proses konsumen</p><ol>{flowSteps.map((step,index)=><li key={step}><Link className={active===index+1?"active":""} href={index===0?"/":`/proses/${index+1}`}>{index+1}. {step}</Link></li>)}</ol></aside>;
}
