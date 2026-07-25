// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
export const runtime = 'edge';
export async function GET(req: NextRequest) {
  const token = req.cookies.get('torque_token')?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user: { id: payload.userId, name: payload.name, email: payload.email, role: payload.role } });
}
