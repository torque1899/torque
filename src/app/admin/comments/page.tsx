'use client';
// src/app/admin/comments/page.tsx
import { useEffect, useState } from 'react';
import { Check, X, Trash2, MessageSquare } from 'lucide-react';

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const load = () => {
    setLoading(true);
    fetch(`/api/comments${filter !== 'all' ? `?status=${filter}` : ''}`)
      .then(r => r.json() as Promise<any>)
      .then(d => setComments(d.comments || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filter]);

  const moderate = async (id: number, status: string) => {
    await fetch(`/api/comments/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setComments(p => p.filter(c => c.id !== id));
  };

  const del = async (id: number) => {
    if (!confirm('Delete this comment?')) return;
    await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    setComments(p => p.filter(c => c.id !== id));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Comments</h1>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {['pending', 'approved', 'rejected', 'all'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} style={{ textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
        ) : comments.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <MessageSquare size={32} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>No {filter} comments.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Author</th><th>Comment</th><th>Post</th><th>Status</th><th>Date</th><th style={{ width: 120 }}>Actions</th></tr>
            </thead>
            <tbody>
              {comments.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.authorName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{c.authorEmail}</div>
                  </td>
                  <td style={{ maxWidth: 300, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {c.content.slice(0, 100)}{c.content.length > 100 ? '…' : ''}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Post #{c.postId}</td>
                  <td>
                    <span className={`badge ${c.status === 'approved' ? 'badge-green' : c.status === 'rejected' ? 'badge-red' : 'badge-yellow'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      {c.status !== 'approved' && <button onClick={() => moderate(c.id, 'approved')} className="btn btn-success btn-sm" title="Approve"><Check size={14} /></button>}
                      {c.status !== 'rejected' && <button onClick={() => moderate(c.id, 'rejected')} className="btn btn-secondary btn-sm" title="Reject"><X size={14} /></button>}
                      <button onClick={() => del(c.id)} className="btn btn-danger btn-sm" title="Delete"><Trash2 size={14} /></button>
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
