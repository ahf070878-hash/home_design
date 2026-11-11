import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [issuedPackages, redeemedVouchers, totalSales, byBrand, byStore, unmatchedDemand] = await prisma.$transaction([
    prisma.designOrder.count({ where: { status: { in: ["PAID", "ISSUED"] } } }),
    prisma.redemptionLog.count(),
    prisma.redemptionLog.aggregate({ _sum: { salesValue: true } }),
    prisma.redemptionLog.groupBy({ by: ["purchasedBrand"], _count: { _all: true }, _sum: { salesValue: true }, orderBy: { _sum: { salesValue: "desc" } } }),
    prisma.redemptionLog.groupBy({ by: ["partnerStoreId"], _count: { _all: true }, _sum: { salesValue: true }, orderBy: { _sum: { salesValue: "desc" } } }),
    prisma.unmatchedCityDemand.groupBy({ by: ["city", "category"], _count: { _all: true }, orderBy: { _count: { city: "desc" } }, take: 50 }),
  ]);
  const specifiedByBrand = await prisma.$queryRaw<Array<{ brand: string; specifiedPackages: number }>>`
    SELECT
      bom_line->>'brand' AS brand,
      COUNT(DISTINCT orders.id)::int AS "specifiedPackages"
    FROM design_orders AS orders
    CROSS JOIN LATERAL jsonb_array_elements(orders.bom_json) AS bom_line
    WHERE orders.status IN ('PAID', 'ISSUED')
      AND bom_line ? 'brand'
    GROUP BY bom_line->>'brand'
    ORDER BY "specifiedPackages" DESC
  `;
  const stores = await prisma.partnerStore.findMany({ where: { id: { in: byStore.map((row) => row.partnerStoreId) } }, select: { id: true, storeCode: true, name: true, city: true } });
  const storeMap = new Map(stores.map((store) => [store.id, store]));
  return NextResponse.json({
    totals: { issuedPackages, redeemedVouchers, salesValue: totalSales._sum.salesValue ?? 0 },
    specifiedByBrand,
    byBrand,
    byStore: byStore.map((row) => ({ ...row, store: storeMap.get(row.partnerStoreId) })),
    unmatchedDemand,
  });
}
