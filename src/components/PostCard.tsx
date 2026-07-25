import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Clock } from 'lucide-react';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string | null;
    createdAt: Date | string | number;
    authorName?: string;
    categories?: { name: string; slug: string }[];
    readTime?: number;
  };
  featured?: boolean;
}

function formatDate(d: Date | string | number) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function estimateReadTime(excerpt: string) {
  return Math.max(1, Math.ceil(excerpt.split(' ').length / 200));
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const readTime = post.readTime ?? estimateReadTime(post.excerpt);

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
        <article className="card fade-in" style={{
          display: 'grid',
          gridTemplateColumns: post.coverImage ? '1fr 1fr' : '1fr',
          minHeight: 400,
          overflow: 'hidden',
        }}>
          {post.coverImage && (
            <div style={{ position: 'relative', minHeight: 300 }}>
              <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, var(--bg-card))' }} />
            </div>
          )}
          <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {post.categories?.[0] && (
              <span className="badge badge-purple" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>
                {post.categories[0].name}
              </span>
            )}
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.875rem', color: 'var(--text)' }}>
              {post.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1.5rem' }}>{post.excerpt}</p>
            <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-light)', fontSize: '0.8rem', flexWrap: 'wrap' }}>
              {post.authorName && <span style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}><User size={13} />{post.authorName}</span>}
              <span style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}><Calendar size={13} />{formatDate(post.createdAt)}</span>
              <span style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}><Clock size={13} />{readTime} min read</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <article className="card fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {post.coverImage && (
          <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
            <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }} />
          </div>
        )}
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
            {post.categories?.map(c => (
              <span key={c.slug} className="badge badge-purple">{c.name}</span>
            ))}
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '0.625rem', color: 'var(--text)' }}>
            {post.title}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, marginBottom: '1.25rem' }}>
            {post.excerpt.slice(0, 120)}{post.excerpt.length > 120 ? '…' : ''}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)', fontSize: '0.775rem' }}>
            <span style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}><Calendar size={12} />{formatDate(post.createdAt)}</span>
            <span style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}><Clock size={12} />{readTime} min</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
