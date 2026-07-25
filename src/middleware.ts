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

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
