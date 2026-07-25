'use client';
// Shared PageForm component for new/edit pages
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const Editor = dynamic(() => import('@/components/Editor').then(m => ({ default: m.Editor })), { ssr: false });

interface PageFormProps {
  initialData?: {
    id?: number;
    title?: string;
    content?: string;
    status?: string;
    showInNav?: boolean;
    navOrder?: number;
  };
  mode: 'new' | 'edit';
}

export default function PageForm({ initialData = {}, mode }: PageFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    status: initialData.status || 'draft',
    showInNav: initialData.showInNav ?? false,
    navOrder: initialData.navOrder ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async (status?: string) => {
    if (!form.title) { setError('Title is required'); return; }
    setSaving(true);
    setError('');
    try {
      const body = { ...form, status: status || form.status };
      const url = mode === 'edit' ? `/api/pages/${initialData.id}` : '/api/pages';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json() as any;
      if (!res.ok) { setError(data.error || 'Save failed'); return; }
      router.push('/admin/pages');
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
      {/* Main */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Link href="/admin/pages" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.875rem' }}>
            <ArrowLeft size={15} /> Back
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{mode === 'new' ? 'New Page' : 'Edit Page'}</h1>
        </div>
        {error && (
          <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, color: '#991b1b', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Page Title</label>
          <input className="form-input" style={{ fontSize: '1.25rem', fontWeight: 600 }} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="About Us, Contact, etc." />
        </div>
        <div className="form-group">
          <label className="form-label">Content</label>
          <Editor value={form.content} onChange={html => setForm(p => ({ ...p, content: html }))} placeholder="Write your page content…" />
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>Publish</h3>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={() => save('published')} className="btn btn-primary" disabled={saving} style={{ justifyContent: 'center' }}>
              <Eye size={15} /> {saving ? 'Saving…' : 'Publish'}
            </button>
            <button onClick={() => save('draft')} className="btn btn-secondary" disabled={saving} style={{ justifyContent: 'center' }}>
              <Save size={15} /> Save Draft
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>Navigation</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', marginBottom: '0.875rem' }}>
            <input type="checkbox" checked={form.showInNav} onChange={e => setForm(p => ({ ...p, showInNav: e.target.checked }))} style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
            <span style={{ fontSize: '0.875rem' }}>Show in navigation menu</span>
          </label>
          {form.showInNav && (
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Nav Order</label>
              <input type="number" className="form-input" value={form.navOrder} onChange={e => setForm(p => ({ ...p, navOrder: Number(e.target.value) }))} min={0} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Lower = appears earlier</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
