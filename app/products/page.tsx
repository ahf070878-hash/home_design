import { AdminConsole, adminStyles } from "@/components/admin-console";
import { DesignManager } from "@/components/design-manager";

export default function ProductsPage() {
  return <AdminConsole activeSection="products">
    <div className={adminStyles.pageHeader}>
      <div><p className={adminStyles.overline}>Katalog customer</p><h1>Produk &amp; desain</h1><p>Upload paket gambar arsitektur di sini atau pilih aset tersimpan sebagai gambar utama desain.</p></div>
      <span className={adminStyles.storageState}>Sumber PostgreSQL</span>
    </div>
    <DesignManager/>
  </AdminConsole>;
}
