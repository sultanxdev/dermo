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
  const isOnInternal = request.nextUrl.pathname.startsWith('/internal');
  const isOnAuth = request.nextUrl.pathname.startsWith('/auth');

  // Protect clinic dashboard
  if (isOnDashboard && !hasSession) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Protect internal operations console
  if (isOnInternal && !hasSession) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect authenticated users away from auth pages to their workspace
  if (isOnAuth && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/internal/:path*', '/auth/:path*'],
};
