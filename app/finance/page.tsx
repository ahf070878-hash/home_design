import Link from "next/link";
import { Banknote, CircleDollarSign, FileCheck2, QrCode } from "lucide-react";
import { connection } from "next/server";
import { OrderStatus, Prisma } from "@/generated/prisma/client";
import { AdminConsole, adminStyles } from "@/components/admin-console";
import { AdminKpi, AdminStatus, EmptyTableRow } from "@/components/admin-data";
import { formatAdminDate, formatCurrency, orderStatusLabels } from "@/lib/admin-format";
import { prisma } from "@/lib/prisma";

const allowedStatuses = new Set<string>(Object.values(OrderStatus));

function orderTone(status: OrderStatus) {
  if (status === "PAID" || status === "ISSUED") return "success" as const;
  if (status === "PENDING_PAYMENT") return "warning" as const;
  if (status === "EXPIRED" || status === "CANCELLED") return "danger" as const;
  return "neutral" as const;
}

export default async function FinancePage({ searchParams }: PageProps<"/finance">) {
  await connection();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 80) : "";
  const status = typeof params.status === "string" && allowedStatuses.has(params.status) ? params.status as OrderStatus : undefined;
  const where: Prisma.DesignOrderWhereInput = {
    ...(status ? { status } : {}),
    ...(query ? { OR: [
      { paymentReference: { contains: query, mode: "insensitive" } },
      { user: { fullName: { contains: query, mode: "insensitive" } } },
      { design: { name: { contains: query, mode: "insensitive" } } },
    ] } : {}),
  };
  const [summary, pendingPayments, issuedOrders, redemptionSummary, orders, redemptions] = await Promise.all([
    prisma.designOrder.aggregate({ _sum: { blueprintPrice: true, customAdaptationFee: true, totalPaid: true } }),
    prisma.designOrder.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.designOrder.count({ where: { status: { in: ["PAID", "ISSUED"] } } }),
    prisma.redemptionLog.aggregate({ _count: { _all: true }, _sum: { salesValue: true, discountAmount: true } }),
    prisma.designOrder.findMany({ where, take: 50, orderBy: { createdAt: "desc" }, include: { user: true, design: true, voucher: true } }),
    prisma.redemptionLog.findMany({ take: 20, orderBy: { redeemedAt: "desc" }, include: { partnerStore: true, voucher: { include: { designOrder: { include: { user: true } } } } } }),
  ]);

  return <AdminConsole activeSection="finance">
    <div className={adminStyles.pageHeader}><div><p className={adminStyles.overline}>Transaksi platform</p><h1>Keuangan</h1><p>Blueprint dan biaya adaptasi dipisahkan dari nilai material toko mitra.</p></div><span className={adminStyles.storageState}>Audit tanpa duplikasi metrik</span></div>
    <section className={adminStyles.kpiGrid} aria-label="Ringkasan keuangan">
      <AdminKpi icon={<CircleDollarSign size={18}/>} label="Pembayaran platform" value={formatCurrency(summary._sum.totalPaid)} note="Total yang benar-benar diterima"/>
      <AdminKpi icon={<FileCheck2 size={18}/>} label="Paket berbayar" value={issuedOrders} note="Status dibayar atau dokumen terbit"/>
      <AdminKpi icon={<Banknote size={18}/>} label="Menunggu pembayaran" value={pendingPayments} note="Invoice belum diselesaikan"/>
      <AdminKpi icon={<QrCode size={18}/>} label="Penjualan toko mitra" value={formatCurrency(redemptionSummary._sum.salesValue)} note={`${redemptionSummary._count._all} penukaran voucher`}/>
    </section>

    <section className={adminStyles.dataPanel}>
      <div className={adminStyles.panelHeading}><div><h2>Pesanan desain</h2><p>Maksimal 50 hasil terbaru.</p></div></div>
      <form className={adminStyles.filterBar} method="get"><label><span>Cari</span><input name="q" defaultValue={query} placeholder="Nama, desain, atau referensi"/></label><label><span>Status</span><select name="status" defaultValue={status ?? ""}><option value="">Semua status</option>{Object.values(OrderStatus).map((value) => <option key={value} value={value}>{orderStatusLabels[value]}</option>)}</select></label><button className={adminStyles.primaryButton} type="submit">Terapkan filter</button>{(query || status) && <Link className={adminStyles.secondaryButton} href="/finance">Reset</Link>}</form>
      <div className={adminStyles.tableWrap}><table className={adminStyles.dataTable}><thead><tr><th>Pelanggan</th><th>Desain</th><th>Blueprint</th><th>Adaptasi</th><th>Dibayar</th><th>Status</th><th>Voucher</th><th>Tanggal</th></tr></thead><tbody>
        {orders.length ? orders.map((order) => <tr key={order.id}><td><strong>{order.user.fullName}</strong><small>{order.paymentReference ?? "Tanpa referensi"}</small></td><td>{order.design.name}</td><td>{formatCurrency(order.blueprintPrice)}</td><td>{formatCurrency(order.customAdaptationFee)}</td><td>{formatCurrency(order.totalPaid)}</td><td><AdminStatus label={orderStatusLabels[order.status]} tone={orderTone(order.status)}/></td><td>{order.voucher ? <AdminStatus label={order.voucher.isRedeemed ? "Sudah ditebus" : "Aktif"} tone={order.voucher.isRedeemed ? "neutral" : "success"}/> : "—"}</td><td>{formatAdminDate(order.createdAt)}</td></tr>) : <EmptyTableRow colSpan={8}>Tidak ada pesanan yang cocok dengan filter.</EmptyTableRow>}
      </tbody></table></div>
    </section>

    <section className={adminStyles.dataPanel}>
      <div className={adminStyles.panelHeading}><div><h2>Audit penukaran voucher</h2><p>Sumber metrik dashboard produsen.</p></div><strong>{formatCurrency(redemptionSummary._sum.discountAmount)} diskon</strong></div>
      <div className={adminStyles.tableWrap}><table className={adminStyles.dataTable}><thead><tr><th>Pelanggan</th><th>Toko mitra</th><th>Merek</th><th>Nilai belanja</th><th>Diskon</th><th>Referensi kasir</th><th>Waktu</th></tr></thead><tbody>
        {redemptions.length ? redemptions.map((log) => <tr key={log.id}><td>{log.voucher.designOrder.user.fullName}</td><td><strong>{log.partnerStore.name}</strong><small>{log.partnerStore.storeCode}</small></td><td>{log.purchasedBrand}</td><td>{formatCurrency(log.salesValue)}</td><td>{formatCurrency(log.discountAmount)}</td><td><code>{log.cashierReference}</code></td><td>{formatAdminDate(log.redeemedAt)}</td></tr>) : <EmptyTableRow colSpan={7}>Belum ada voucher yang ditebus.</EmptyTableRow>}
      </tbody></table></div>
    </section>
  </AdminConsole>;
}
