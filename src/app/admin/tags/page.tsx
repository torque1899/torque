'use client';
// src/app/admin/tags/page.tsx
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminTagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    fetch('/api/tags').then(r => r.json() as Promise<any>).then(d => setTags(d.tags || [])).finally(() => setLoading(false));
  }, []);

  const add = async () => {
    if (!newName.trim()) return;
    const res = await fetch('/api/tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName.trim() }) });
    const data = await res.json() as any;
    if (res.ok) { setTags(p => [...p, data.tag]); setNewName(''); }
  };

  const del = async (id: number) => {
    if (!confirm('Delete this tag?')) return;
    await fetch('/api/tags', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setTags(p => p.filter(t => t.id !== id));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 700 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Tags</h1>

      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>Add Tag</h3>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input className="form-input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Tag name" style={{ flex: 1 }} onKeyDown={e => e.key === 'Enter' && add()} />
          <button onClick={add} className="btn btn-primary" disabled={!newName.trim()}><Plus size={15} /> Add</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
        {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> :
          tags.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No tags yet.</p> :
          tags.map(tag => (
            <div key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 999 }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{tag.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>#{tag.slug}</span>
              <button onClick={() => del(tag.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', display: 'flex', alignItems: 'center', padding: 0 }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );
}
