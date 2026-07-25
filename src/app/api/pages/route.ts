// src/app/api/pages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { pages } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { verifyToken, slugify } from '@/lib/auth';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const navOnly = searchParams.get('nav') === 'true';
    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);

    const conditions = navOnly
      ? [eq(pages.showInNav, true), eq(pages.status, 'published')]
      : [];

    const results = await db.select().from(pages)
      .where(conditions.length > 0 ? eq(pages.showInNav, true) : undefined)
      .orderBy(asc(pages.navOrder));
    return NextResponse.json({ pages: results });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('torque_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload || (payload.role !== 'admin' && payload.role !== 'author')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { title, content, status, showInNav, navOrder } = await req.json() as any;
    if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });
    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);
    const [page] = await db.insert(pages).values({
      title, slug: slugify(title), content: content || '',
      status: status || 'draft',
      showInNav: showInNav ?? false,
      navOrder: navOrder ?? 0,
      authorId: payload.userId,
      createdAt: new Date(), updatedAt: new Date(),
    }).returning();
    return NextResponse.json({ page }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
