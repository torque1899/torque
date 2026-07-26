// src/app/(blog)/[slug]/page.tsx — Static pages (About, Contact, etc.)
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const runtime = 'edge';

async function getPage(slug: string) {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/pages/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json() as any).page;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  return { title: page?.title || 'Page' };
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page || page.status !== 'published') notFound();

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container-sm">
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.025em' }}>
          {page.title}
        </h1>
        <hr className="divider" style={{ marginBottom: '2rem' }} />
        <div className="prose-content" dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </div>
  );
}
