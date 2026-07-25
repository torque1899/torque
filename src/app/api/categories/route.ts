// src/app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { categories } from '@/lib/db/schema';
import { verifyToken, slugify } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
  try {
    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);
    const all = await db.select().from(categories);
    return NextResponse.json({ categories: all });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('torque_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { name, description } = await req.json() as any;
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });
    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);
    const [cat] = await db.insert(categories).values({ name, slug: slugify(name), description }).returning();
    return NextResponse.json({ category: cat }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
