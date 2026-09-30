import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for Better Auth session cookie
  const hasSession =
    request.cookies.has('better-auth.session_token') ||
    request.cookies.has('dermo.session_token') ||
    request.cookies.has('__Secure-dermo.session_token') ||
    request.cookies.has('__Secure-better-auth.session_token');

  const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  const isOnAuth =
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/forgot-password' ||
    request.nextUrl.pathname === '/reset-password';

  if (isOnDashboard && !hasSession) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isOnAuth && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/login', '/forgot-password', '/reset-password'],
};
