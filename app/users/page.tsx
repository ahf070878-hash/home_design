import Link from "next/link";
import { CircleUserRound, LandPlot, LockKeyhole, ShieldCheck } from "lucide-react";
import { connection } from "next/server";
import { OtpStatus, Prisma } from "@/generated/prisma/client";
import { AdminConsole, adminStyles } from "@/components/admin-console";
import { AdminKpi, AdminStatus, EmptyTableRow } from "@/components/admin-data";
import { formatAdminDate, otpStatusLabels } from "@/lib/admin-format";
import { prisma } from "@/lib/prisma";

const allowedStatuses = new Set<string>(Object.values(OtpStatus));

function otpTone(status: OtpStatus) {
  if (status === "VERIFIED") return "success" as const;
  if (status === "LOCKED") return "danger" as const;
  return "warning" as const;
}

export default async function UsersPage({ searchParams }: PageProps<"/users">) {
  await connection();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 80) : "";
  const status = typeof params.status === "string" && allowedStatuses.has(params.status) ? params.status as OtpStatus : undefined;
  const where: Prisma.UserWhereInput = {
    ...(status ? { otpStatus: status } : {}),
    ...(query ? { OR: [
      { fullName: { contains: query, mode: "insensitive" } },
      { phone: { contains: query } },
      { buildLocation: { contains: query, mode: "insensitive" } },
    ] } : {}),
  };
  const [total, verified, pending, locked, users, unfulfilledLands] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { otpStatus: "VERIFIED" } }),
    prisma.user.count({ where: { otpStatus: "PENDING" } }),
    prisma.user.count({ where: { otpStatus: "LOCKED" } }),
    prisma.user.findMany({ where, take: 100, orderBy: { createdAt: "desc" }, include: { _count: { select: { lands: true, orders: true, notifications: true } } } }),
    prisma.customerLand.findMany({ where: { status: "UNFULFILLED" }, take: 20, orderBy: { createdAt: "desc" }, include: { user: true } }),
  ]);

  return <AdminConsole activeSection="users">
    <div className={adminStyles.pageHeader}><div><p className={adminStyles.overline}>Akun dan kebutuhan lahan</p><h1>Pengguna</h1><p>Pantau verifikasi OTP, lokasi pembangunan, pesanan, dan permintaan lahan.</p></div><span className={adminStyles.storageState}>Maksimal 100 hasil</span></div>
    <section className={adminStyles.kpiGrid} aria-label="Ringkasan pengguna">
      <AdminKpi icon={<CircleUserRound size={18}/>} label="Total pengguna" value={total} note="Akun yang sudah tertaut"/>
      <AdminKpi icon={<ShieldCheck size={18}/>} label="Terverifikasi" value={verified} note="OTP berhasil diverifikasi"/>
      <AdminKpi icon={<LandPlot size={18}/>} label="Menunggu OTP" value={pending} note="Belum menyelesaikan verifikasi"/>
      <AdminKpi icon={<LockKeyhole size={18}/>} label="Akun terkunci" value={locked} note="Memerlukan pemeriksaan manual"/>
    </section>

    <section className={adminStyles.dataPanel}>
      <div className={adminStyles.panelHeading}><div><h2>Daftar pengguna</h2><p>Data akun setelah guest session ditautkan.</p></div></div>
      <form className={adminStyles.filterBar} method="get"><label><span>Cari</span><input name="q" defaultValue={query} placeholder="Nama, telepon, atau lokasi"/></label><label><span>Status OTP</span><select name="status" defaultValue={status ?? ""}><option value="">Semua status</option>{Object.values(OtpStatus).map((value) => <option key={value} value={value}>{otpStatusLabels[value]}</option>)}</select></label><button className={adminStyles.primaryButton} type="submit">Terapkan filter</button>{(query || status) && <Link className={adminStyles.secondaryButton} href="/users">Reset</Link>}</form>
      <div className={adminStyles.tableWrap}><table className={adminStyles.dataTable}><thead><tr><th>Pengguna</th><th>Telepon</th><th>Lokasi bangun</th><th>Status OTP</th><th>Lahan</th><th>Pesanan</th><th>Notifikasi</th><th>Bergabung</th></tr></thead><tbody>
        {users.length ? users.map((user) => <tr key={user.id}><td><strong>{user.fullName}</strong><small>{user.id.slice(0, 8)}</small></td><td>{user.phone}</td><td>{user.buildLocation}</td><td><AdminStatus label={otpStatusLabels[user.otpStatus]} tone={otpTone(user.otpStatus)}/></td><td>{user._count.lands}</td><td>{user._count.orders}</td><td>{user._count.notifications}</td><td>{formatAdminDate(user.createdAt)}</td></tr>) : <EmptyTableRow colSpan={8}>Tidak ada pengguna yang cocok dengan filter.</EmptyTableRow>}
      </tbody></table></div>
    </section>

    <section className={adminStyles.dataPanel}>
      <div className={adminStyles.panelHeading}><div><h2>Permintaan lahan belum terpenuhi</h2><p>Tetap tersimpan meski berasal dari sesi tamu.</p></div><strong>{unfulfilledLands.length} permintaan</strong></div>
      <div className={adminStyles.tableWrap}><table className={adminStyles.dataTable}><thead><tr><th>Pemilik</th><th>Kota</th><th>Kecamatan</th><th>Ukuran lahan</th><th>Catatan</th><th>Dibuat</th></tr></thead><tbody>
        {unfulfilledLands.length ? unfulfilledLands.map((land) => <tr key={land.id}><td>{land.user?.fullName ?? <AdminStatus label="Sesi tamu"/>}</td><td>{land.city}</td><td>{land.district ?? "—"}</td><td>{land.widthM.toString()} × {land.lengthM.toString()} m</td><td>{land.requestNote ?? "—"}</td><td>{formatAdminDate(land.createdAt)}</td></tr>) : <EmptyTableRow colSpan={6}>Tidak ada permintaan lahan yang belum terpenuhi.</EmptyTableRow>}
      </tbody></table></div>
    </section>
  </AdminConsole>;
}
