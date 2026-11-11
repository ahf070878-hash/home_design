import { Activity, BadgeDollarSign, CircleUserRound, FileCheck2, LandPlot, QrCode } from "lucide-react";
import { connection } from "next/server";
import { AdminConsole, adminStyles } from "@/components/admin-console";
import { AdminKpi, AdminStatus, EmptyTableRow } from "@/components/admin-data";
import { formatAdminDate, formatCurrency, orderStatusLabels } from "@/lib/admin-format";
import { prisma } from "@/lib/prisma";

function orderTone(status: string) {
  if (status === "PAID" || status === "ISSUED") return "success" as const;
  if (status === "PENDING_PAYMENT") return "warning" as const;
  if (status === "EXPIRED" || status === "CANCELLED") return "danger" as const;
  return "neutral" as const;
}

export default async function AdminDashboardPage() {
  await connection();
  const [users, verifiedUsers, lands, unfulfilledLands, orders, activeOrders, paymentTotal, redemptions, pendingNotifications, recentOrders, recentRedemptions, demand] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { otpStatus: "VERIFIED" } }),
    prisma.customerLand.count(),
    prisma.customerLand.count({ where: { status: "UNFULFILLED" } }),
    prisma.designOrder.count(),
    prisma.designOrder.count({ where: { status: { in: ["PAID", "ISSUED"] } } }),
    prisma.designOrder.aggregate({ _sum: { totalPaid: true } }),
    prisma.redemptionLog.count(),
    prisma.userNotification.count({ where: { status: "PENDING" } }),
    prisma.designOrder.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { user: true, design: true } }),
    prisma.redemptionLog.findMany({ take: 5, orderBy: { redeemedAt: "desc" }, include: { partnerStore: true } }),
    prisma.unmatchedCityDemand.groupBy({ by: ["city", "category"], _count: { city: true }, orderBy: { _count: { city: "desc" } }, take: 5 }),
  ]);

  return <AdminConsole activeSection="dashboard">
    <div className={adminStyles.pageHeader}><div><p className={adminStyles.overline}>Kondisi platform</p><h1>Ringkasan operasional</h1><p>Pantau akun, pesanan, permintaan lahan, dan penukaran voucher.</p></div><span className={adminStyles.storageState}>Data langsung PostgreSQL</span></div>
    <section className={adminStyles.kpiGrid} aria-label="Indikator utama">
      <AdminKpi icon={<CircleUserRound size={18}/>} label="Pengguna" value={users} note={`${verifiedUsers} akun terverifikasi`}/>
      <AdminKpi icon={<LandPlot size={18}/>} label="Data lahan" value={lands} note={`${unfulfilledLands} permintaan belum terpenuhi`}/>
      <AdminKpi icon={<FileCheck2 size={18}/>} label="Pesanan aktif" value={activeOrders} note={`${orders} pesanan seluruh status`}/>
      <AdminKpi icon={<BadgeDollarSign size={18}/>} label="Pembayaran diterima" value={formatCurrency(paymentTotal._sum.totalPaid)} note="Blueprint dan adaptasi custom"/>
      <AdminKpi icon={<QrCode size={18}/>} label="Voucher ditebus" value={redemptions} note="Berdasarkan redemption_logs"/>
      <AdminKpi icon={<Activity size={18}/>} label="Notifikasi tertunda" value={pendingNotifications} note="Menunggu pengiriman setelah commit"/>
    </section>

    <div className={adminStyles.dashboardGrid}>
      <section className={adminStyles.dataPanel}>
        <div className={adminStyles.panelHeading}><div><h2>Pesanan terbaru</h2><p>Enam transaksi terakhir.</p></div><a href="/finance">Lihat keuangan</a></div>
        <div className={adminStyles.tableWrap}><table className={adminStyles.dataTable}><thead><tr><th>Pelanggan</th><th>Desain</th><th>Status</th><th>Nilai</th><th>Waktu</th></tr></thead><tbody>
          {recentOrders.length ? recentOrders.map((order) => <tr key={order.id}><td><strong>{order.user.fullName}</strong><small>{order.paymentReference ?? "Belum ada referensi"}</small></td><td>{order.design.name}</td><td><AdminStatus label={orderStatusLabels[order.status]} tone={orderTone(order.status)}/></td><td>{formatCurrency(order.totalPaid)}</td><td>{formatAdminDate(order.createdAt)}</td></tr>) : <EmptyTableRow colSpan={5}>Belum ada pesanan.</EmptyTableRow>}
        </tbody></table></div>
      </section>

      <aside className={adminStyles.sideStack}>
        <section className={adminStyles.dataPanel}><div className={adminStyles.panelHeading}><div><h2>Penukaran terbaru</h2><p>Audit dari kasir mitra.</p></div></div>{recentRedemptions.length ? <ul className={adminStyles.activityList}>{recentRedemptions.map((log) => <li key={log.id}><div><strong>{log.purchasedBrand}</strong><span>{log.partnerStore.name}</span></div><div><strong>{formatCurrency(log.salesValue)}</strong><time>{formatAdminDate(log.redeemedAt)}</time></div></li>)}</ul> : <p className={adminStyles.emptyState}>Belum ada voucher yang ditebus.</p>}</section>
        <section className={adminStyles.dataPanel}><div className={adminStyles.panelHeading}><div><h2>Permintaan belum terlayani</h2><p>Kota dan kategori teratas.</p></div></div>{demand.length ? <ul className={adminStyles.demandList}>{demand.map((row) => {
          const count = typeof row._count === "object" ? row._count.city ?? 0 : 0;
          return <li key={`${row.city}-${row.category}`}><span>{row.city}<small>{row.category}</small></span><strong>{count}</strong></li>;
        })}</ul> : <p className={adminStyles.emptyState}>Belum ada permintaan material yang tidak terlayani.</p>}</section>
      </aside>
    </div>
  </AdminConsole>;
}
