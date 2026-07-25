'use client';
// src/app/admin/pages/page.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Navigation } from 'lucide-react';

export default function AdminPagesPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pages').then(r => r.json() as Promise<any>).then(d => setPages(d.pages || [])).finally(() => setLoading(false));
  }, []);

  const deletePage = async (id: number) => {
    if (!confirm('Delete this page?')) return;
    await fetch(`/api/pages/${id}`, { method: 'DELETE' });
    setPages(p => p.filter(x => x.id !== id));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>Pages</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Static pages like About, Contact, etc.</p>
        </div>
        <Link href="/admin/pages/new" className="btn btn-primary"><Plus size={16} /> New Page</Link>
      </div>
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
        ) : pages.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No pages yet.</p>
            <Link href="/admin/pages/new" className="btn btn-primary"><Plus size={15} /> Create Page</Link>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>In Nav</th>
                <th>Nav Order</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id}>
                  <td style={{ fontWeight: 500 }}>{page.title}</td>
                  <td><span className={`badge ${page.status === 'published' ? 'badge-green' : 'badge-yellow'}`}>{page.status}</span></td>
                  <td>
                    {page.showInNav ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--success)', fontSize: '0.8rem' }}>
                        <Navigation size={13} /> Yes
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>No</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{page.navOrder}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <Link href={`/admin/pages/${page.id}/edit`} className="btn btn-secondary btn-sm"><Edit size={14} /></Link>
                      <button onClick={() => deletePage(page.id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
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
