// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { verifyToken } from '@/lib/auth';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('torque_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload || (payload.role !== 'admin' && payload.role !== 'author')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });

    const allowed = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-zip-compressed'
    ];
    if (!allowed.includes(file.type)) return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });

    const ext = file.name.split('.').pop();
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { env } = await getCloudflareContext();
    const arrayBuffer = await file.arrayBuffer();
    await env.R2.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
      customMetadata: { uploadedBy: String(payload.userId), originalName: file.name },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.pages.dev';
    const url = `${siteUrl}/api/media/${key}`;

    return NextResponse.json({ url, key }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
