import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminRoute = path === "/pengaturan" || path.startsWith("/pengaturan/") || path === "/media" || path.startsWith("/media/") || path === "/products" || path.startsWith("/products/") || path === "/finance" || path.startsWith("/finance/") || path === "/users" || path.startsWith("/users/") || path === "/admin" || path.startsWith("/admin/") || path.startsWith("/api/admin/");

  if (process.env.APP_SURFACE === "admin") {
    if (path === "/") return NextResponse.redirect(new URL("/admin", request.url));
    if (path.startsWith("/uploads/media/") || path.startsWith("/api/media/")) return NextResponse.next();
    return isAdminRoute ? NextResponse.next() : new NextResponse("Not Found", { status: 404 });
  }

  return isAdminRoute ? new NextResponse("Not Found", { status: 404 }) : NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|assets|favicon.ico).*)"],
};
