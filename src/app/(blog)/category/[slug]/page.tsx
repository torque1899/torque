// src/app/(blog)/category/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/PostCard';
import { FolderOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const runtime = 'edge';

async function getCategory(slug: string) {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json() as any;
    return data.categories?.find((c: any) => c.slug === slug) || null;
  } catch { return null; }
}

async function getPostsByCategory(slug: string) {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/posts?status=published&category=${slug}&limit=20`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return (await res.json() as any).posts || [];
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategory(slug);
  return { title: cat ? `${cat.name} Articles` : 'Category' };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, posts] = await Promise.all([getCategory(slug), getPostsByCategory(slug)]);
  if (!category) notFound();

  return (
    <div style={{ padding: '3rem 0 4rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderOpen size={20} style={{ color: 'var(--accent)' }} />
            </div>
            <span className="badge badge-purple">Category</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{category.name}</h1>
          {category.description && <p style={{ color: 'var(--text-muted)' }}>{category.description}</p>}
          <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{posts.length} article{posts.length !== 1 ? 's' : ''}</p>
        </div>

        {posts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {posts.map((post: any) => <PostCard key={post.id} post={post} />)}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>No posts in this category yet.</p>
        )}
      </div>
    </div>
  );
}
