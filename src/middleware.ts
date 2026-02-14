/**
 * Next.js Middleware
 * - Protects /dashboard/* routes (requires auth)
 * - Protects /admin/* routes (requires ADMIN role)
 * - Redirects authenticated users away from /auth/* pages
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // ── Dashboard: require authentication ──
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    const session = await verifyToken(token);
    if (!session) {
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.set("token", "", { maxAge: 0, path: "/" });
      return response;
    }
  }

  // ── Admin: require ADMIN role ──
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    const session = await verifyToken(token);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // ── Auth pages: redirect if already logged in ──
  if (pathname.startsWith("/auth/")) {
    if (token) {
      const session = await verifyToken(token);
      if (session) {
        const target =
          session.role === "ADMIN" ? "/admin" : "/dashboard";
        return NextResponse.redirect(new URL(target, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/:path*"],
};
