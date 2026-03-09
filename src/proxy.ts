import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/config/env';

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const publicPaths = ['/login'];
  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: { cookie: request.headers.get('cookie') || '' },
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
