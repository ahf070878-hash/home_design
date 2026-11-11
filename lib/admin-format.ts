import type { OrderStatus, OtpStatus } from "@/generated/prisma/client";

const currency = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const dateTime = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });

export function formatCurrency(value: number | string | { toString(): string } | null | undefined) {
  return currency.format(Number(value ?? 0));
}

export function formatAdminDate(value: Date) {
  return dateTime.format(value);
}

export const orderStatusLabels: Record<OrderStatus, string> = {
  DRAFT: "Draf",
  PENDING_PAYMENT: "Menunggu pembayaran",
  PAID: "Sudah dibayar",
  EXPIRED: "Kedaluwarsa",
  CANCELLED: "Dibatalkan",
  ISSUED: "Dokumen terbit",
};

export const otpStatusLabels: Record<OtpStatus, string> = {
  PENDING: "Belum terverifikasi",
  VERIFIED: "Terverifikasi",
  LOCKED: "Terkunci",
};
