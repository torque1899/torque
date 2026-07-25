'use client';
// src/app/admin/media/page.tsx
import { useState, useRef } from 'react';
import { Upload, Copy, Trash2, Image as ImageIcon } from 'lucide-react';

interface MediaItem {
  key: string;
  url: string;
  name: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json() as any;
        if (res.ok) {
          setMedia(p => [...p, { key: data.key, url: data.url, name: file.name }]);
        }
      }
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>Media Library</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Images are stored in Cloudflare R2</p>
        </div>
        <button className="btn btn-primary" onClick={() => inputRef.current?.click()} disabled={uploading}>
          <Upload size={16} /> {uploading ? 'Uploading…' : 'Upload Images'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => upload(e.target.files)} />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); upload(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: '2px dashed var(--border)', borderRadius: 'var(--radius)',
          padding: '3rem', textAlign: 'center', marginBottom: '2rem',
          cursor: 'pointer', transition: 'all 0.2s ease',
          background: 'var(--bg-secondary)',
        }}
      >
        <ImageIcon size={40} style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} />
        <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Drop images here or click to upload</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>PNG, JPG, GIF, WebP — max 10MB each</p>
      </div>

      {/* Uploaded images grid */}
      {media.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {media.map(item => (
            <div key={item.key} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: 140 }}>
                <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '0.75rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                <button
                  onClick={() => copyUrl(item.url)}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Copy size={13} /> {copied === item.url ? '✓ Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {media.length === 0 && !uploading && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem' }}>
          No images uploaded in this session. Existing images in R2 are served via the API.
        </p>
      )}
    </div>
  );
}
