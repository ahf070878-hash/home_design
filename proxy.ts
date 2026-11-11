import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, readAdminSessionToken } from "@/lib/admin-auth";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminRoute = path === "/pengaturan" || path.startsWith("/pengaturan/") || path === "/media" || path.startsWith("/media/") || path === "/products" || path.startsWith("/products/") || path === "/finance" || path.startsWith("/finance/") || path === "/users" || path.startsWith("/users/") || path === "/admin" || path.startsWith("/admin/") || path.startsWith("/api/admin/");

  if (process.env.APP_SURFACE === "admin") {
    const isLoginRoute = path === "/admin/login" || path === "/api/admin/auth/login";
    const session = readAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
    if (path === "/") return NextResponse.redirect(new URL(session ? "/admin" : "/admin/login", request.url));
    if (isLoginRoute) return session && path === "/admin/login" ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
    if (path.startsWith("/uploads/media/") || path.startsWith("/api/media/")) return NextResponse.next();
    if (!isAdminRoute) return new NextResponse("Not Found", { status: 404 });
    if (!session) {
      return path.startsWith("/api/")
        ? NextResponse.json({ error: "Sesi admin tidak valid atau sudah berakhir." }, { status: 401 })
        : NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  return isAdminRoute ? new NextResponse("Not Found", { status: 404 }) : NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|assets|favicon.ico).*)"],
};
