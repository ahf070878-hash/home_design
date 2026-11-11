import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_SECONDS, createAdminSessionToken, verifyAdminPassword } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: unknown; password?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || email.length > 254 || !password || password.length > 128) {
    return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin?.isActive || !verifyAdminPassword(password, admin.passwordHash)) {
    return NextResponse.json({ error: "Email atau password admin tidak valid." }, { status: 401 });
  }

  const token = createAdminSessionToken({ sub: admin.id, email: admin.email, role: admin.role });
  const response = NextResponse.json({ ok: true, displayName: admin.displayName, role: admin.role });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
  await prisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
  return response;
}
