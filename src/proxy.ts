import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password'];

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const isStatic = /^\/(api|_next|favicon)/.test(pathname);

  if (isStatic) return NextResponse.next();

  let isAuthenticated = false;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3003';
    const res = await fetch(`${apiUrl}/api/auth/me`, {
      headers: { cookie: request.headers.get('cookie') ?? '' },
    });
    isAuthenticated = res.ok;
  } catch {}

  if (!isAuthenticated && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
