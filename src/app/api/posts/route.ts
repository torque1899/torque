// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { posts, users, postCategories, postTags, categories, tags } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { verifyToken, slugify } from '@/lib/auth';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);

    const conditions = status ? [eq(posts.status, status as any)] : [eq(posts.status, 'published')];
    const results = await db
      .select({
        id: posts.id, title: posts.title, slug: posts.slug,
        excerpt: posts.excerpt, coverImage: posts.coverImage,
        status: posts.status, createdAt: posts.createdAt,
        authorName: users.name,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(and(...conditions))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ posts: results });
  } catch (err) {
    console.error(err);
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

    const body = await req.json() as any;
    const { title, content, excerpt, coverImage, status, categoryIds = [], tagIds = [] } = body;
    if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

    const slug = slugify(title);
    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);

    const [post] = await db.insert(posts).values({
      title, slug, content: content || '', excerpt: excerpt || '',
      coverImage, status: status || 'draft',
      authorId: payload.userId,
      createdAt: new Date(), updatedAt: new Date(),
    }).returning();

    if (categoryIds.length > 0) {
      await db.insert(postCategories).values(categoryIds.map((cid: number) => ({ postId: post.id, categoryId: cid })));
    }
    if (tagIds.length > 0) {
      await db.insert(postTags).values(tagIds.map((tid: number) => ({ postId: post.id, tagId: tid })));
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
