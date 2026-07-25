// src/app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { categories } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken, slugify } from '@/lib/auth';

export const runtime = 'edge';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('torque_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const { name, description } = await req.json() as any;
    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);
    const [updated] = await db.update(categories).set({ name, slug: slugify(name), description })
      .where(eq(categories.id, Number(id))).returning();
    return NextResponse.json({ category: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('torque_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);
    await db.delete(categories).where(eq(categories.id, Number(id)));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
