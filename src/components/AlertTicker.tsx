'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flame } from 'lucide-react';

interface SimplePost {
  id: string | number;
  title: string;
  slug: string;
}

export function AlertTicker() {
  const [posts, setPosts] = useState<SimplePost[]>([]);

  useEffect(() => {
    // Try to load settings first
    fetch('/api/settings?key=homepage')
      .then((res) => (res.ok ? res.json() : null) as Promise<any>)
      .then((data) => {
        if (data && data.value && data.value.alerts && data.value.alerts.length > 0) {
          setPosts(
            data.value.alerts.map((alert: string, idx: number) => ({
              id: `manual-${idx}`,
              title: alert,
              slug: '', // Text-only manual alert
            }))
          );
        } else {
          // Fallback to posts
          fetch('/api/posts?status=published&limit=5')
            .then((res) => (res.ok ? res.json() : null) as Promise<any>)
            .then((data) => {
              if (data && data.posts) {
                setPosts(data.posts);
              }
            });
        }
      })
      .catch(() => {
        // Fallback directly to posts
        fetch('/api/posts?status=published&limit=5')
          .then((res) => (res.ok ? res.json() : null) as Promise<any>)
          .then((data) => {
            if (data && data.posts) {
              setPosts(data.posts);
            }
          });
      });
  }, []);

  if (posts.length === 0) return null;

  const renderAlert = (post: SimplePost, keyId: string | number) => {
    const hasLink = !!post.slug;
    const content = (
      <>
        <span style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#fca5a5',
          display: 'inline-block',
        }} />
        {post.title}
      </>
    );

    return hasLink ? (
      <Link
        key={keyId}
        href={`/blog/${post.slug}`}
        style={{
          color: 'white',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {content}
      </Link>
    ) : (
      <span
        key={keyId}
        style={{
          color: 'white',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {content}
      </span>
    );
  };

  return (
    <div style={{
      background: 'linear-gradient(90deg, #b91c1c 0%, #dc2626 50%, #b91c1c 100%)',
      color: 'white',
      fontSize: '0.85rem',
      fontWeight: 600,
      padding: '0.5rem 1rem',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 90,
    }}>
      {/* Ticker Title Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        background: 'rgba(0, 0, 0, 0.3)',
        padding: '0.25rem 0.75rem',
        borderRadius: '4px',
        marginRight: '1rem',
        flexShrink: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <Flame size={14} color="#fca5a5" />
        <span>Latest Alerts</span>
      </div>

      {/* Scrolling Text Container */}
      <div style={{
        overflow: 'hidden',
        position: 'relative',
        flexGrow: 1,
        height: '20px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          gap: '3rem',
          position: 'absolute',
          whiteSpace: 'nowrap',
          animation: 'marquee 25s linear infinite',
        }}>
          {posts.map((post) => renderAlert(post, post.id))}
          {/* Duplicate list for seamless continuous scrolling */}
          {posts.map((post) => renderAlert(post, `dup-${post.id}`))}
        </div>
      </div>

      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  );
}
