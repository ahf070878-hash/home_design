import { AdminLoginForm } from "@/components/admin-login-form";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  return <main className={styles.page}>
    <section className={styles.card}>
      <div className={styles.brand}><span>HB</span><div><strong>HuniBangun</strong><small>Admin Console</small></div></div>
      <div className={styles.heading}><p>AKSES TERBATAS</p><h1>Masuk ke admin</h1><span>Gunakan akun admin demo untuk meninjau dashboard dan menguji pengelolaan konten.</span></div>
      <AdminLoginForm/>
      <p className={styles.notice}>Sesi berakhir otomatis setelah 8 jam. Jangan gunakan akun demo sebagai kredensial produksi.</p>
    </section>
  </main>;
}
