// src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { posts, users, postCategories, postTags, categories, tags } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken, slugify } from '@/lib/auth';

export const runtime = 'edge';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);

    const isSlug = isNaN(Number(id));
    const [post] = await db.select({
      id: posts.id, title: posts.title, slug: posts.slug, content: posts.content,
      excerpt: posts.excerpt, coverImage: posts.coverImage, status: posts.status,
      createdAt: posts.createdAt, updatedAt: posts.updatedAt,
      authorId: posts.authorId, authorName: users.name,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(isSlug ? eq(posts.slug, id) : eq(posts.id, Number(id)))
    .limit(1);

    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const cats = await db.select({ name: categories.name, slug: categories.slug })
      .from(postCategories).leftJoin(categories, eq(postCategories.categoryId, categories.id))
      .where(eq(postCategories.postId, post.id));
    const ts = await db.select({ name: tags.name, slug: tags.slug })
      .from(postTags).leftJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, post.id));

    return NextResponse.json({ post: { ...post, categories: cats, tags: ts } });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('torque_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload || (payload.role !== 'admin' && payload.role !== 'author')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json() as any;
    const { title, content, excerpt, coverImage, status, categoryIds = [], tagIds = [] } = body;

    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);

    const [updated] = await db.update(posts).set({
      title, content, excerpt, coverImage, status,
      slug: slugify(title),
      updatedAt: new Date(),
    }).where(eq(posts.id, Number(id))).returning();

    await db.delete(postCategories).where(eq(postCategories.postId, Number(id)));
    await db.delete(postTags).where(eq(postTags.postId, Number(id)));
    if (categoryIds.length > 0) {
      await db.insert(postCategories).values(categoryIds.map((cid: number) => ({ postId: Number(id), categoryId: cid })));
    }
    if (tagIds.length > 0) {
      await db.insert(postTags).values(tagIds.map((tid: number) => ({ postId: Number(id), tagId: tid })));
    }

    return NextResponse.json({ post: updated });
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
    await db.delete(posts).where(eq(posts.id, Number(id)));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
