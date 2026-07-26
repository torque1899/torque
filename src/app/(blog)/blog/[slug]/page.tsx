// src/app/(blog)/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, User, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CommentSection } from '@/components/CommentSection';
import type { Metadata } from 'next';

export const runtime = 'edge';

async function getPost(slug: string) {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/posts/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json() as any;
    return data.post;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
      type: 'article',
    },
  };
}

function formatDate(d: any) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || post.status !== 'published') notFound();

  const readTime = Math.max(1, Math.ceil(post.content.replace(/<[^>]+>/g, '').split(' ').length / 200));

  return (
    <article style={{ paddingBottom: '4rem' }}>
      {/* Cover image */}
      {post.coverImage && (
        <div style={{ position: 'relative', height: '50vh', minHeight: 320, maxHeight: 500, overflow: 'hidden' }}>
          <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }} priority />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
        </div>
      )}

      <div className="container-sm" style={{ paddingTop: post.coverImage ? '2rem' : '3rem' }}>
        {/* Back */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem', fontWeight: 500 }}>
          <ArrowLeft size={15} /> Back to Home
        </Link>

        {/* Categories */}
        {post.categories?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {post.categories.map((c: any) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="badge badge-purple">{c.name}</Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.025em' }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {post.authorName && (
            <span style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
              <User size={14} /> {post.authorName}
            </span>
          )}
          <span style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
            <Calendar size={14} /> {formatDate(post.createdAt)}
          </span>
          <span style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
            <Clock size={14} /> {readTime} min read
          </span>
        </div>

        <hr className="divider" />

        {/* Content */}
        <div className="prose-content" style={{ marginTop: '2rem' }} dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Tag size={15} style={{ color: 'var(--text-muted)' }} />
            {post.tags.map((t: any) => (
              <Link key={t.slug} href={`/tag/${t.slug}`} className="badge badge-gray">{t.name}</Link>
            ))}
          </div>
        )}

        <hr className="divider" style={{ marginTop: '3rem' }} />

        {/* Comments */}
        <CommentSection postId={post.id} />
      </div>
    </article>
  );
}
