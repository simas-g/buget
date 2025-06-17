 import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/prisijungti' || pathname === '/registracija';
  const token = request.cookies.get('SESSION_KEY');

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/skydelis', request.url));
  }
  if(!token && pathname === '/skydelis') {
    return NextResponse.redirect(new URL('/prisijungti', request.url))
  }
  return NextResponse.next();
}
