'use client';
// src/app/admin/posts/page.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/posts?limit=100&status=all')
      .then(r => r.json() as Promise<any>)
      .then(d => setPosts(d.posts || []))
      .finally(() => setLoading(false));
  }, []);

  const deletePost = async (id: number) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    setPosts(p => p.filter(x => x.id !== id));
  };

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>Posts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{posts.length} total posts</p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-primary"><Plus size={16} /> New Post</Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {['all', 'published', 'draft'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} style={{ textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No posts found.</p>
            <Link href="/admin/posts/new" className="btn btn-primary"><Plus size={15} /> Create Post</Link>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Author</th>
                <th>Date</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id}>
                  <td style={{ fontWeight: 500 }}>{post.title}</td>
                  <td><span className={`badge ${post.status === 'published' ? 'badge-green' : 'badge-yellow'}`}>{post.status}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{post.authorName}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      {post.status === 'published' && (
                        <a href={`/blog/${post.slug}`} target="_blank" className="btn btn-secondary btn-sm" title="View"><Eye size={14} /></a>
                      )}
                      <Link href={`/admin/posts/${post.id}/edit`} className="btn btn-secondary btn-sm" title="Edit"><Edit size={14} /></Link>
                      <button onClick={() => deletePost(post.id)} className="btn btn-danger btn-sm" title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
