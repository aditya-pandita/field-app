import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("field-token")?.value;
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage = req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup";

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
