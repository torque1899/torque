// src/app/api/media/[...key]/route.ts
// Serve files from R2
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';

export const runtime = 'edge';

export async function GET(_: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
  try {
    const { key } = await params;
    const objectKey = key.join('/');
    const { env } = await getCloudflareContext();
    const object = await env.R2.get(objectKey);
    if (!object) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('cache-control', 'public, max-age=31536000, immutable');

    return new NextResponse(object.body, { headers });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
