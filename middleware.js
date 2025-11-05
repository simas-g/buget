import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname === "/prisijungti" || pathname === "/registracija";
  const sessionId = request.cookies.get("SESSION_KEY")?.value;
  const testModeId = request.cookies.get("TEST_MODE")?.value;
  
  if (isAuthPage && (sessionId || testModeId)) {
    return NextResponse.redirect(new URL("/skydelis", request.url));
  }
  if (!sessionId && !testModeId && pathname.includes("/skydelis")) {
    return NextResponse.redirect(new URL("/prisijungti", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const requestHeaders = new Headers(request.headers);
    if (sessionId) {
      requestHeaders.set("Authorization", "Bearer " + sessionId);
    } else if (testModeId) {
      requestHeaders.set("Authorization", "Bearer test_mode_session");
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  return NextResponse.next();
}
