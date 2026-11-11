import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { AdminRole, ApplicationVisualKind, LandRequestStatus, OrderStatus, OtpStatus, Prisma, PrismaClient } from "../generated/prisma/client.ts";
import { hashAdminPassword } from "../lib/admin-auth.ts";
import { designs, materials } from "../lib/mock-data.ts";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL wajib diisi sebelum menjalankan seed.");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const ids = {
  user: "00000000-0000-4000-8000-000000000001",
  land: "00000000-0000-4000-8000-000000000002",
  unfulfilledLand: "00000000-0000-4000-8000-000000000003",
  demand: "00000000-0000-4000-8000-000000000004",
  order: "00000000-0000-4000-8000-000000000005",
  voucher: "00000000-0000-4000-8000-000000000006",
  store: "00000000-0000-4000-8000-000000000007",
};

async function main() {
  const demoAdminEmail = (process.env.DEMO_ADMIN_EMAIL || "demo.admin@hunibangun.id").trim().toLowerCase();
  const demoAdminPassword = process.env.DEMO_ADMIN_PASSWORD || "DemoHuniBangun#2026";
  await prisma.adminUser.upsert({
    where: { email: demoAdminEmail },
    update: { displayName: "Admin Demo HuniBangun", passwordHash: hashAdminPassword(demoAdminPassword), role: AdminRole.ADMIN, isActive: true },
    create: { email: demoAdminEmail, displayName: "Admin Demo HuniBangun", passwordHash: hashAdminPassword(demoAdminPassword), role: AdminRole.ADMIN, isActive: true },
  });
  await prisma.siteSetting.upsert({
    where: { key: "hero_media" },
    update: {},
    create: {
      key: "hero_media",
      value: {
        videoUrl: "/assets/hero/home-design.mp4",
        posterUrl: "/assets/hero/home-design-poster.jpg",
      },
    },
  });
  await prisma.siteSetting.upsert({
    where: { key: "site_typography" },
    update: {},
    create: {
      key: "site_typography",
      value: {
        bodyFontId: "ibm-plex-sans", displayFontId: "newsreader",
        bodySizePx: 16, displaySizePx: 84, textColor: "#17382e",
        bodyWeight: 400, displayWeight: 700,
      },
    },
  });

  for (const design of designs) {
    await prisma.design.upsert({
      where: { code: design.id },
      update: {
        name: design.name, type: design.type, style: design.style,
        minLandWidthM: design.width, minLandLengthM: design.length,
        floors: design.floors, bedrooms: design.bedrooms, bathrooms: design.bathrooms,
        blueprintPrice: design.price, baseRab: design.baseRab,
        facadeVariants: design.facadeVariants, layoutVariants: design.layoutVariants, isActive: true,
      },
      create: {
        id: design.id, code: design.id, name: design.name, type: design.type, style: design.style,
        minLandWidthM: design.width, minLandLengthM: design.length,
        floors: design.floors, bedrooms: design.bedrooms, bathrooms: design.bathrooms,
        blueprintPrice: design.price, baseRab: design.baseRab, mainImageUrl: design.image,
        facadeVariants: design.facadeVariants, layoutVariants: design.layoutVariants,
      },
    });
  }

  for (const material of materials) {
    await prisma.materialsCatalog.upsert({
      where: { id: material.id },
      update: {
        category: material.category, brand: material.brand, productName: material.name,
        unit: material.unit, unitPrice: material.unitPrice, discountPercent: material.discount,
        packageImageUrl: material.packageImage, applicationImageUrl: material.applicationImage,
        applicationKind: material.applicationKind === "render" ? ApplicationVisualKind.RENDER : ApplicationVisualKind.DIAGRAM,
        availableCities: material.cities, isActive: true,
      },
      create: {
        id: material.id, category: material.category, brand: material.brand, productName: material.name,
        unit: material.unit, unitPrice: material.unitPrice, discountPercent: material.discount,
        packageImageUrl: material.packageImage, applicationImageUrl: material.applicationImage,
        applicationKind: material.applicationKind === "render" ? ApplicationVisualKind.RENDER : ApplicationVisualKind.DIAGRAM,
        availableCities: material.cities,
      },
    });
  }

  const user = await prisma.user.upsert({
    where: { phone: "081234567890" },
    update: { fullName: "Budi Santoso", buildLocation: "Bandung", otpStatus: OtpStatus.VERIFIED, otpVerifiedAt: new Date() },
    create: { id: ids.user, fullName: "Budi Santoso", phone: "081234567890", buildLocation: "Bandung", otpStatus: OtpStatus.VERIFIED, otpVerifiedAt: new Date() },
  });
  const land = await prisma.customerLand.upsert({
    where: { id: ids.land },
    update: { userId: user.id, widthM: 8, lengthM: 15, city: "Bandung", district: "Cibiru", status: LandRequestStatus.MATCHED },
    create: { id: ids.land, userId: user.id, widthM: 8, lengthM: 15, city: "Bandung", district: "Cibiru", status: LandRequestStatus.MATCHED },
  });
  await prisma.customerLand.upsert({
    where: { id: ids.unfulfilledLand },
    update: { guestSessionId: "guest-unfulfilled-demo", widthM: 4, lengthM: 7, city: "Makassar", status: LandRequestStatus.UNFULFILLED, requestNote: "Belum ada type yang muat." },
    create: { id: ids.unfulfilledLand, guestSessionId: "guest-unfulfilled-demo", widthM: 4, lengthM: 7, city: "Makassar", status: LandRequestStatus.UNFULFILLED, requestNote: "Belum ada type yang muat." },
  });

  const store = await prisma.partnerStore.upsert({
    where: { storeCode: "TB-BDG-001" },
    update: { name: "Mitra Bangun Cibiru", city: "Bandung", address: "Jl. Raya Cibiru 101, Bandung", supportedBrands: ["SIG", "Onduline", "Roman", "Dulux", "Wavin"], isActive: true },
    create: { id: ids.store, storeCode: "TB-BDG-001", name: "Mitra Bangun Cibiru", city: "Bandung", address: "Jl. Raya Cibiru 101, Bandung", supportedBrands: ["SIG", "Onduline", "Roman", "Dulux", "Wavin"] },
  });

  const selectedMaterials = [...new Set(materials.map((material) => material.category))].map((category) => materials.find((material) => material.category === category)!);
  const bom = selectedMaterials.map((material) => ({
    materialId: material.id, category: material.category, brand: material.brand,
    product: material.name, unit: material.unit, unitPrice: material.unitPrice,
    discountPercent: material.discount,
  })) satisfies Prisma.InputJsonValue;
  const design = designs[0];
  const order = await prisma.designOrder.upsert({
    where: { paymentReference: "PAY-DEMO-001" },
    update: { status: OrderStatus.ISSUED, bomJson: bom, paidAt: new Date() },
    create: {
      id: ids.order, userId: user.id, customerLandId: land.id, designId: design.id,
      selectedFacade: design.facadeVariants[0], selectedLayout: design.layoutVariants[0], bomJson: bom,
      estimatedRab: design.baseRab * 1.03, materialDiscountEstimate: 525_000,
      customAdaptation: false, blueprintPrice: design.price, totalPaid: design.price,
      status: OrderStatus.ISSUED, paymentReference: "PAY-DEMO-001", paidAt: new Date(),
    },
  });
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 6);
  await prisma.qrVoucher.upsert({
    where: { token: "TB-HB001-2026-7X9K" },
    update: { designOrderId: order.id, bomJson: bom, expiresAt, isRedeemed: false, redeemedAt: null },
    create: { id: ids.voucher, designOrderId: order.id, token: "TB-HB001-2026-7X9K", bomJson: bom, expiresAt },
  });
  await prisma.unmatchedCityDemand.upsert({
    where: { id: ids.demand },
    update: { userId: user.id, city: "Bandung", category: "Keramik & Saniter", requestedBrand: "TOTO", designId: design.id },
    create: { id: ids.demand, userId: user.id, city: "Bandung", category: "Keramik & Saniter", requestedBrand: "TOTO", designId: design.id },
  });

  console.info(`Seed selesai: akun admin demo ${demoAdminEmail}, ${designs.length} desain, ${materials.length} material, toko ${store.storeCode}, token TB-HB001-2026-7X9K.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => prisma.$disconnect());
