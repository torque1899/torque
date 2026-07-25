'use client';
// Shared PostForm component used by new/edit post pages
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, Eye, ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';

const Editor = dynamic(() => import('@/components/Editor').then(m => ({ default: m.Editor })), { ssr: false });

interface PostFormProps {
  initialData?: {
    id?: number;
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    status?: string;
    categoryIds?: number[];
    tagIds?: number[];
  };
  mode: 'new' | 'edit';
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

export default function PostForm({ initialData = {}, mode }: PostFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    excerpt: initialData.excerpt || '',
    coverImage: initialData.coverImage || '',
    status: initialData.status || 'draft',
    categoryIds: initialData.categoryIds || [] as number[],
    tagIds: initialData.tagIds || [] as number[],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json() as Promise<any>),
      fetch('/api/tags').then(r => r.json() as Promise<any>),
    ]).then(([cats, ts]) => {
      setCategories(cats.categories || []);
      setTags(ts.tags || []);
    });
  }, []);

  const save = async (status?: string) => {
    if (!form.title) { setError('Title is required'); return; }
    setSaving(true);
    setError('');
    try {
      const body = { ...form, status: status || form.status };
      const url = mode === 'edit' ? `/api/posts/${initialData.id}` : '/api/posts';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json() as any;
      if (!res.ok) { setError(data.error || 'Save failed'); return; }
      router.push('/admin/posts');
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json() as any;
      if (res.ok) setForm(p => ({ ...p, coverImage: data.url }));
    } finally {
      setUploading(false);
    }
  };

  const toggleCategory = (id: number) => {
    setForm(p => ({
      ...p,
      categoryIds: p.categoryIds.includes(id) ? p.categoryIds.filter(x => x !== id) : [...p.categoryIds, id],
    }));
  };

  const toggleTag = (id: number) => {
    setForm(p => ({
      ...p,
      tagIds: p.tagIds.includes(id) ? p.tagIds.filter(x => x !== id) : [...p.tagIds, id],
    }));
  };

  return (
    <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
      {/* Main content */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Link href="/admin/posts" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.875rem' }}>
            <ArrowLeft size={15} /> Back
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{mode === 'new' ? 'New Post' : 'Edit Post'}</h1>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, color: '#991b1b', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" style={{ fontSize: '1.25rem', fontWeight: 600 }} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Post title…" />
        </div>

        <div className="form-group">
          <label className="form-label">Excerpt</label>
          <textarea className="form-textarea" value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} placeholder="Short description shown in cards and SEO…" rows={3} />
        </div>

        <div className="form-group">
          <label className="form-label">Content</label>
          <Editor value={form.content} onChange={html => setForm(p => ({ ...p, content: html }))} />
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '1rem' }}>
        {/* Publish */}
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

        {/* Cover image */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>Cover Image</h3>
          {form.coverImage && (
            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <img src={form.coverImage} alt="Cover" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }} />
              <button onClick={() => setForm(p => ({ ...p, coverImage: '' }))} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                <X size={12} />
              </button>
            </div>
          )}
          <div>
            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', justifyContent: 'center' }}>
              <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload Image'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={uploadImage} />
            </label>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <input className="form-input" value={form.coverImage} onChange={e => setForm(p => ({ ...p, coverImage: e.target.value }))} placeholder="Or paste image URL…" style={{ fontSize: '0.8rem' }} />
          </div>
        </div>

        {/* Categories */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 160, overflowY: 'auto' }}>
            {categories.map((c) => (
              <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="checkbox" checked={form.categoryIds.includes(c.id)} onChange={() => toggleCategory(c.id)} style={{ accentColor: 'var(--accent)' }} />
                {c.name}
              </label>
            ))}
            {categories.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No categories yet. <Link href="/admin/categories" style={{ color: 'var(--accent)' }}>Add one</Link></p>}
          </div>
        </div>

        {/* Tags */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Tags</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {tags.map((t) => (
              <button key={t.id} onClick={() => toggleTag(t.id)} className={`badge ${form.tagIds.includes(t.id) ? 'badge-purple' : 'badge-gray'}`} style={{ cursor: 'pointer', border: 'none' }}>
                {t.name}
              </button>
            ))}
            {tags.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No tags yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
