import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/forgot-password'];
const AUTH_COOKIE_NAME = 'auth_token';

function getAuthTokenFromRequest(request: NextRequest): string | null {
  const cookie = request.cookies.get(AUTH_COOKIE_NAME);
  return cookie?.value ?? null;
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const isStatic = /^\/(api|_next|favicon)/.test(pathname);

  if (isStatic) return NextResponse.next();

  // Check authentication by token presence only (don't call private API from edge)
  const token = getAuthTokenFromRequest(request);
  const isAuthenticated = !!token;

  if (!isAuthenticated && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && isPublic) {
    return NextResponse.redirect(new URL('/programs', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
