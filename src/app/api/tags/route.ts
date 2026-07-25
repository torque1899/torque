// src/app/api/tags/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { tags } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken, slugify } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
  try {
    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);
    const all = await db.select().from(tags);
    return NextResponse.json({ tags: all });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('torque_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { name } = await req.json() as any;
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });
    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);
    const [tag] = await db.insert(tags).values({ name, slug: slugify(name) }).returning();
    return NextResponse.json({ tag }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('torque_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await req.json() as any;
    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);
    await db.delete(tags).where(eq(tags.id, Number(id)));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
