import { AdminConsole, adminStyles } from "@/components/admin-console";
import { MediaLibrary } from "@/components/media-library";

export default function MediaPage() {
  return <AdminConsole activeSection="media">
    <div className={adminStyles.pageHeader}>
      <div>
        <p className={adminStyles.overline}>Pusat aset situs</p>
        <h1>Pustaka aset</h1>
        <p>Review, gunakan ulang, dan kelola seluruh gambar atau video. Paket arsitektur diunggah melalui menu Produk &amp; desain dan otomatis tercatat di sini.</p>
      </div>
      <span className={adminStyles.storageState}>Penyimpanan lokal</span>
    </div>
    <MediaLibrary/>
  </AdminConsole>;
}
