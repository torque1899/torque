'use client';
// src/app/admin/page.tsx — Dashboard
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, BookOpen, MessageSquare, Users, TrendingUp, Plus, Eye } from 'lucide-react';

interface Stats {
  posts: number;
  pages: number;
  comments: number;
  users: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ posts: 0, pages: 0, comments: 0, users: 0 });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json() as Promise<any>),
      fetch('/api/posts?limit=5&status=all').then(r => r.json() as Promise<any>).catch(() => ({ posts: [] })),
      fetch('/api/posts?limit=1000&status=all').then(r => r.json() as Promise<any>).catch(() => ({ posts: [] })),
      fetch('/api/pages').then(r => r.json() as Promise<any>).catch(() => ({ pages: [] })),
      fetch('/api/comments').then(r => r.json() as Promise<any>).catch(() => ({ comments: [] })),
    ]).then(([me, recent, allPosts, pages, comments]) => {
      setUser(me.user);
      setRecentPosts(recent.posts || []);
      setStats({
        posts: allPosts.posts?.length || 0,
        pages: pages.pages?.length || 0,
        comments: comments.comments?.length || 0,
        users: 0,
      });
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Posts', value: stats.posts, icon: FileText, color: '#6d28d9', href: '/admin/posts' },
    { label: 'Pages', value: stats.pages, icon: BookOpen, color: '#0891b2', href: '/admin/pages' },
    { label: 'Pending Comments', value: stats.comments, icon: MessageSquare, color: '#d97706', href: '/admin/comments' },
    { label: 'Users', value: stats.users, icon: Users, color: '#059669', href: '/admin/users' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          {loading ? 'Dashboard' : `Welcome back, ${user?.name?.split(' ')[0] || 'Admin'} 👋`}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Here's what's happening with your blog today.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} style={{ color }} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1, color: 'var(--text)' }}>{loading ? '–' : value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/admin/posts/new" className="btn btn-primary"><Plus size={16} /> New Post</Link>
          <Link href="/admin/pages/new" className="btn btn-secondary"><Plus size={16} /> New Page</Link>
          <Link href="/admin/categories" className="btn btn-secondary"><Plus size={16} /> Add Category</Link>
          <Link href="/" target="_blank" className="btn btn-secondary"><Eye size={16} /> View Blog</Link>
        </div>
      </div>

      {/* Recent posts */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Recent Posts</h2>
          <Link href="/admin/posts" className="btn btn-secondary btn-sm">View all</Link>
        </div>
        <div className="card" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
          ) : recentPosts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No posts yet. <Link href="/admin/posts/new" style={{ color: 'var(--accent)' }}>Create your first post</Link>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post: any) => (
                  <tr key={post.id}>
                    <td style={{ fontWeight: 500, maxWidth: 300 }}>{post.title}</td>
                    <td><span className={`badge ${post.status === 'published' ? 'badge-green' : 'badge-yellow'}`}>{post.status}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{post.authorName}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link href={`/admin/posts/${post.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
