// src/app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { comments } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const postId = searchParams.get('postId');
    const status = searchParams.get('status');
    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);

    const conditions: any[] = [];
    if (postId) conditions.push(eq(comments.postId, Number(postId)));
    if (status) conditions.push(eq(comments.status, status as any));
    else if (!postId) conditions.push(eq(comments.status, 'pending')); // Admin default: pending
    else conditions.push(eq(comments.status, 'approved')); // Public: approved only

    const results = await db.select().from(comments)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(comments.createdAt));
    return NextResponse.json({ comments: results });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as any;
    const { content, authorName, authorEmail, postId, parentId } = body;
    if (!content || !authorName || !authorEmail || !postId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const { env } = await getCloudflareContext();
    const db = drizzle(env.DB);
    const [comment] = await db.insert(comments).values({
      content, authorName, authorEmail,
      postId: Number(postId),
      parentId: parentId ? Number(parentId) : undefined,
      status: 'pending',
      createdAt: new Date(),
    }).returning();
    return NextResponse.json({ comment, message: 'Comment submitted for moderation' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
