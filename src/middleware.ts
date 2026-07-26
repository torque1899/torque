// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('torque_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    const payload = await verifyToken(token);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'author')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  const response = NextResponse.next();

  if (pathname === '/') {
    response.headers.set(
      'Link',
      '</.well-known/api-catalog>; rel="api-catalog", </.well-known/service-desc>; rel="service-desc", </.well-known/service-doc>; rel="service-doc", </llms.txt>; rel="describedby"'
    );
  }

  return response;
}

export const config = {
  matcher: ['/', '/admin/:path*'],
};
