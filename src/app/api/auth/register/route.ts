// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { getCloudflareContext } from '@/lib/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json() as any;
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);

    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({
      name, email, passwordHash, role: 'reader',
      createdAt: new Date(),
    }).returning();

    const token = await signToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
    const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
    res.cookies.set('torque_token', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
