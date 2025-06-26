import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname === "/prisijungti" || pathname === "/registracija";
  const sessionId = request.cookies.get("SESSION_KEY")?.value;
  if (isAuthPage && sessionId) {
    return NextResponse.redirect(new URL("/skydelis", request.url));
  }
  if (!sessionId && pathname.includes("/skydelis")) {
    return NextResponse.redirect(new URL("/prisijungti", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const requestHeaders = new Headers(request.headers);
    if (sessionId) {
      requestHeaders.set("Authorization", "Bearer " + sessionId);
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  return NextResponse.next();
}
