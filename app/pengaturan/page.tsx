import { AdminConsole, adminStyles } from "@/components/admin-console";
import { HeroVideoSettings } from "@/components/hero-video-settings";
import { TypographySettings } from "@/components/typography-settings";

export default function SettingsPage() {
  return <AdminConsole activeSection="settings"><div className={adminStyles.pageHeader}><div><p className={adminStyles.overline}>Konten situs customer</p><h1>Tampilan customer</h1><p>Kelola media hero dan sistem tipografi halaman publik pada port 3015.</p></div><span className={adminStyles.storageState}><i/>Tersimpan di PostgreSQL</span></div><section className={adminStyles.settingSection}><div className={adminStyles.sectionHeading}><h2>Media hero</h2><p>Video latar dan poster halaman utama.</p></div><HeroVideoSettings/></section><section className={adminStyles.settingSection}><div className={adminStyles.sectionHeading}><h2>Font dan warna</h2><p>Atur keluarga font, ukuran, ketebalan, dan warna teks customer.</p></div><TypographySettings/></section></AdminConsole>;
}
