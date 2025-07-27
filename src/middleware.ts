import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname.startsWith("/admin/login");
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
  const isGetRequest = request.method === "GET";

  const needAuth = isAdminPage && !isLoginPage;
  const needRedirect = needAuth && isGetRequest;

  if (!needRedirect) {
    return NextResponse.next();
  }

  const jwtSession = request.cookies.get(
    process.env.LOGIN_COOKIE_NAME || "loginSession"
  )?.value;
  const isAuthenticated = !!jwtSession;

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
