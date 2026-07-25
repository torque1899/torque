'use client';
// src/app/admin/categories/page.tsx
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetch('/api/categories').then(r => r.json() as Promise<any>).then(d => setCategories(d.categories || [])).finally(() => setLoading(false));
  }, []);

  const add = async () => {
    if (!newName) return;
    setAdding(true);
    const res = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName, description: newDesc }) });
    const data = await res.json() as any;
    if (res.ok) { setCategories(p => [...p, data.category]); setNewName(''); setNewDesc(''); }
    setAdding(false);
  };

  const del = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    setCategories(p => p.filter(c => c.id !== id));
  };

  const saveEdit = async (id: number) => {
    const res = await fetch(`/api/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editName }) });
    const data = await res.json() as any;
    if (res.ok) { setCategories(p => p.map(c => c.id === id ? data.category : c)); setEditing(null); }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 700 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Categories</h1>

      {/* Add form */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>Add Category</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input className="form-input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Category name" style={{ flex: 1, minWidth: 180 }} onKeyDown={e => e.key === 'Enter' && add()} />
          <input className="form-input" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (optional)" style={{ flex: 2, minWidth: 200 }} />
          <button onClick={add} className="btn btn-primary" disabled={adding || !newName}>
            <Plus size={15} /> Add
          </button>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
        ) : categories.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No categories yet.</div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Name</th><th>Slug</th><th>Description</th><th style={{ width: 100 }}>Actions</th></tr></thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td>
                    {editing === cat.id ? (
                      <input className="form-input" value={editName} onChange={e => setEditName(e.target.value)} style={{ padding: '0.375rem 0.625rem', fontSize: '0.875rem' }} autoFocus />
                    ) : (
                      <span style={{ fontWeight: 500 }}>{cat.name}</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{cat.slug}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{cat.description || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      {editing === cat.id ? (
                        <>
                          <button onClick={() => saveEdit(cat.id)} className="btn btn-success btn-sm"><Check size={14} /></button>
                          <button onClick={() => setEditing(null)} className="btn btn-secondary btn-sm"><X size={14} /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditing(cat.id); setEditName(cat.name); }} className="btn btn-secondary btn-sm"><Edit size={14} /></button>
                          <button onClick={() => del(cat.id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                        </>
                      )}
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
