import type { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { BadgeDollarSign, House, Image, LayoutDashboard, LibraryBig, LockKeyhole, LogOut, Settings, Users } from "lucide-react";
import styles from "./admin-console.module.css";
import { ADMIN_SESSION_COOKIE, readAdminSessionToken, type AdminRole } from "@/lib/admin-auth";

type AdminSection = "dashboard" | "settings" | "media" | "products" | "finance" | "users";

const sectionLabels: Record<AdminSection, string> = {
  dashboard: "Ringkasan operasional",
  settings: "Konfigurasi sistem",
  media: "Pengelolaan aset",
  products: "Produk dan desain",
  finance: "Keuangan dan pembayaran",
  users: "Pengguna dan verifikasi",
};

export async function AdminConsole({ children, activeSection = "settings" }: { children: ReactNode; activeSection?: AdminSection }) {
  const session = readAdminSessionToken((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  const role: AdminRole = session?.role ?? "EDITOR";
  const canEditContent = role === "ADMIN" || role === "EDITOR";
  const canViewFinance = role === "ADMIN" || role === "FINANCE";
  const isAdmin = role === "ADMIN";
  return <div className={styles.console}>
    <aside className={styles.sidebar}>
      <div className={styles.identity}><span className={styles.mark}>HB</span><div><strong>HuniBangun</strong><small>Admin Console</small></div></div>
      <nav className={styles.navigation} aria-label="Navigasi admin">
        <p>Workspace</p>
        <Link className={activeSection === "dashboard" ? styles.activeItem : undefined} href="/admin" aria-current={activeSection === "dashboard" ? "page" : undefined}><LayoutDashboard size={18}/>Ringkasan</Link>
        {canEditContent && <Link className={activeSection === "settings" ? styles.activeItem : undefined} href="/pengaturan" aria-current={activeSection === "settings" ? "page" : undefined}><Image size={18}/>Tampilan situs</Link>}
        {canEditContent && <Link className={activeSection === "media" ? styles.activeItem : undefined} href="/media" aria-current={activeSection === "media" ? "page" : undefined}><LibraryBig size={18}/>Pustaka aset</Link>}
        {canEditContent && <Link className={activeSection === "products" ? styles.activeItem : undefined} href="/products" aria-current={activeSection === "products" ? "page" : undefined}><House size={18}/>Produk &amp; desain</Link>}
        {canViewFinance && <Link className={activeSection === "finance" ? styles.activeItem : undefined} href="/finance" aria-current={activeSection === "finance" ? "page" : undefined}><BadgeDollarSign size={18}/>Keuangan</Link>}
        {isAdmin && <Link className={activeSection === "users" ? styles.activeItem : undefined} href="/users" aria-current={activeSection === "users" ? "page" : undefined}><Users size={18}/>Pengguna</Link>}
      </nav>
      <div className={styles.security}><LockKeyhole size={17}/><div><strong>Permukaan terpisah</strong><small>Admin · port 3016</small></div></div>
    </aside>
    <div className={styles.workspace}>
      <header className={styles.topbar}><div><Settings size={17}/><span>{sectionLabels[activeSection]}</span></div><div className={styles.topbarActions}><span className={styles.environment}><i/>Role {role}</span><form action="/api/admin/auth/logout" method="post"><button type="submit"><LogOut size={15}/>Keluar</button></form></div></header>
      <main className={styles.content}>{children}</main>
    </div>
  </div>;
}

export { styles as adminStyles };
