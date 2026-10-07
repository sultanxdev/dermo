import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Canonicalize legacy /auth routes
  if (pathname === '/auth/login' || pathname === '/auth') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (pathname === '/auth/signup') {
    return NextResponse.redirect(new URL('/book-demo', request.url));
  }

  // Check for Better Auth session cookie
  const hasSession =
    request.cookies.has('better-auth.session_token') ||
    request.cookies.has('dermo.session_token') ||
    request.cookies.has('__Secure-dermo.session_token') ||
    request.cookies.has('__Secure-better-auth.session_token');

  const isOnDashboard = pathname.startsWith('/dashboard');
  const isOnInternal = pathname.startsWith('/internal');
  const isOnLogin = pathname === '/login' || pathname.startsWith('/auth');

  // Protect clinic dashboard
  if (isOnDashboard && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect internal operations console
  if (isOnInternal && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from auth/login pages to their workspace
  if (isOnLogin && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/internal/:path*', '/login', '/auth/:path*'],
};
