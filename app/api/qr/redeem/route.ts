import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

class RedemptionError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

type BomLine = { brand?: unknown };

function bomContainsBrand(value: Prisma.JsonValue, brand: string) {
  return Array.isArray(value) && value.some((line) => line && typeof line === "object" && !Array.isArray(line) && (line as BomLine).brand === brand);
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") throw new RedemptionError("Payload penebusan tidak valid.", 400);
    const data = body as Record<string, unknown>;
    const token = typeof data.token === "string" ? data.token.trim() : "";
    const partnerStoreId = typeof data.partnerStoreId === "string" ? data.partnerStoreId : "";
    const cashierReference = typeof data.cashierReference === "string" ? data.cashierReference.trim() : "";
    const purchasedBrand = typeof data.purchasedBrand === "string" ? data.purchasedBrand.trim() : "";
    const salesValue = Number(data.salesValue);
    const discountAmount = Number(data.discountAmount);
    if (!token || !partnerStoreId || !cashierReference || !purchasedBrand || !(salesValue > 0) || !(discountAmount >= 0)) {
      throw new RedemptionError("Token, toko, referensi kasir, merek, dan nilai transaksi wajib valid.", 400);
    }

    const now = new Date();
    const result = await prisma.$transaction(async (tx) => {
      const [voucher, store] = await Promise.all([
        tx.qrVoucher.findUnique({ where: { token }, include: { designOrder: { select: { userId: true, id: true } } } }),
        tx.partnerStore.findUnique({ where: { id: partnerStoreId } }),
      ]);
      if (!voucher) throw new RedemptionError("Token QR tidak ditemukan.", 404);
      if (!store || !store.isActive) throw new RedemptionError("Toko mitra tidak aktif atau tidak ditemukan.", 404);
      if (voucher.isRedeemed) throw new RedemptionError("QR sudah pernah ditebus.", 409);
      if (voucher.expiresAt <= now) throw new RedemptionError("QR sudah kedaluwarsa.", 410);
      if (!store.supportedBrands.includes(purchasedBrand)) throw new RedemptionError("Toko ini tidak terdaftar untuk merek tersebut.", 422);
      if (!bomContainsBrand(voucher.bomJson, purchasedBrand)) throw new RedemptionError("Merek tidak cocok dengan BOM voucher.", 422);
      const bomSnapshot = voucher.bomJson as Prisma.InputJsonArray;

      const claimed = await tx.qrVoucher.updateMany({
        where: { id: voucher.id, isRedeemed: false, expiresAt: { gt: now } },
        data: { isRedeemed: true, redeemedAt: now },
      });
      if (claimed.count !== 1) throw new RedemptionError("QR baru saja ditebus atau kedaluwarsa. Muat ulang status.", 409);

      const log = await tx.redemptionLog.create({ data: {
        qrVoucherId: voucher.id, partnerStoreId, cashierReference, purchasedBrand,
        salesValue, discountAmount, bomSnapshot,
      }});
      await tx.partnerStore.update({ where: { id: partnerStoreId }, data: {
        redemptionCount: { increment: 1 }, redemptionSalesValue: { increment: salesValue },
      }});
      const notification = await tx.userNotification.create({ data: {
        userId: voucher.designOrder.userId,
        type: "QR_REDEEMED",
        payload: { orderId: voucher.designOrder.id, voucherId: voucher.id, storeName: store.name, purchasedBrand, salesValue, discountAmount, redeemedAt: now.toISOString() },
      }});
      return { logId: log.id, notificationId: notification.id, redeemedAt: log.redeemedAt };
    }, { maxWait: 5_000, timeout: 10_000 });

    return NextResponse.json({ ok: true, status: "DITEBUS", notificationQueued: true, ...result });
  } catch (error) {
    if (error instanceof RedemptionError) return NextResponse.json({ error: error.message }, { status: error.status });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return NextResponse.json({ error: "QR sudah pernah ditebus." }, { status: 409 });
    console.error("QR redemption failed", error);
    return NextResponse.json({ error: "Penebusan QR gagal. Silakan coba lagi." }, { status: 500 });
  }
}
