// src/app/(blog)/tag/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/PostCard';
import { Tag } from 'lucide-react';
import type { Metadata } from 'next';

async function getTag(slug: string) {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/tags`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json() as any;
    return data.tags?.find((t: any) => t.slug === slug) || null;
  } catch { return null; }
}

async function getPostsByTag(slug: string) {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/posts?status=published&tag=${slug}&limit=20`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return (await res.json() as any).posts || [];
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTag(slug);
  return { title: tag ? `#${tag.name} Articles` : 'Tag' };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [tag, posts] = await Promise.all([getTag(slug), getPostsByTag(slug)]);
  if (!tag) notFound();

  return (
    <div style={{ padding: '3rem 0 4rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={20} style={{ color: 'var(--accent)' }} />
            </div>
            <span className="badge badge-gray">Tag</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>#{tag.name}</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>{posts.length} article{posts.length !== 1 ? 's' : ''} tagged</p>
        </div>
        {posts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {posts.map((post: any) => <PostCard key={post.id} post={post} />)}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>No posts with this tag yet.</p>
        )}
      </div>
    </div>
  );
}
