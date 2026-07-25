// src/app/(blog)/page.tsx
import { PostCard } from '@/components/PostCard';
import { ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Torque — Modern Blogging Platform',
  description: 'Discover great articles and stories on Torque.',
};

async function getPosts(limit = 9) {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/posts?status=published&limit=${limit}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json() as any;
    return data.posts || [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json() as any;
    return data.categories || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  const [featured, ...rest] = posts;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0f1a2e 100%)',
        padding: '5rem 0 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,40,217,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -150, left: -50, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(109,40,217,0.15)', border: '1px solid rgba(109,40,217,0.3)', borderRadius: 999, padding: '0.375rem 1rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={14} color="#a78bfa" />
            <span style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: 600 }}>Fresh Ideas, Bold Writing</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
            Stories that{' '}
            <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              move you
            </span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#9ca3af', maxWidth: 560, margin: '0 auto 2rem', lineHeight: 1.65 }}>
            Discover in-depth articles, tutorials, and insights crafted for curious minds.
          </p>
          {categories.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {categories.slice(0, 6).map((c: any) => (
                <Link key={c.slug} href={`/category/${c.slug}`} style={{
                  padding: '0.375rem 1rem', borderRadius: 999,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#d1d5db', fontSize: '0.85rem', textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}>
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container" style={{ paddingTop: '3rem' }}>
        {/* Featured post */}
        {featured && (
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 4, height: 20, background: 'var(--accent)', borderRadius: 2, display: 'inline-block' }} />
                Featured
              </h2>
            </div>
            <PostCard post={featured} featured />
          </section>
        )}

        {/* Latest posts grid */}
        {rest.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 4, height: 20, background: 'var(--accent)', borderRadius: 2, display: 'inline-block' }} />
                Latest Articles
              </h2>
              <Link href="/blog" className="btn btn-secondary btn-sm">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {rest.map((post: any) => <PostCard key={post.id} post={post} />)}
            </div>
          </section>
        )}

        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>No posts yet.</p>
            <Link href="/admin/posts/new" className="btn btn-primary">Write your first post</Link>
          </div>
        )}
      </div>
    </div>
  );
}
