import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname === "/prisijungti" || pathname === "/registracija";
  const sessionId = request.cookies.get("SESSION_KEY")?.value;
  const testModeId = request.cookies.get("TEST_MODE")?.value;
  
  const isTestModeAllowedPath = pathname.startsWith("/test-mode") || 
                                pathname.startsWith("/skydelis") ||
                                pathname.startsWith("/api/");
  
  if (testModeId && !isTestModeAllowedPath) {
    const response = NextResponse.redirect(new URL("/test-mode", request.url));
    response.cookies.delete("TEST_MODE");
    return response;
  }
  
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

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
