import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('user_id');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  // Allow access to auth pages and api routes without authentication
  if (isAuthPage || request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Redirect to login if accessing protected pages without authentication
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Allow access to protected pages if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
