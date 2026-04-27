import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { canAccessDashboard, canAccessRegistration } from "@/lib/permissions";

/**
 * Next.js 16 uses this file as the app middleware (not `middleware.ts`).
 * Gate routes by gateway JWT permissions, not by a hardcoded username.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (!req.auth?.user) {
    return NextResponse.next();
  }

  const permissions = req.auth.user.permissions ?? [];

  if (pathname === "/dashboard" && !canAccessDashboard(permissions)) {
    if (canAccessRegistration(permissions)) {
      return NextResponse.redirect(new URL("/registration", req.url));
    }
    return NextResponse.redirect(new URL("/no-access", req.url));
  }

  if (pathname === "/registration" && !canAccessRegistration(permissions)) {
    if (canAccessDashboard(permissions)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/no-access", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/dashboard", "/registration", "/register"],
};
