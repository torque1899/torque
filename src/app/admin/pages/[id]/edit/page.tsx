'use client';
import { useEffect, useState } from 'react';
import PageForm from '@/components/PageForm';
import { use } from 'react';

export const runtime = 'edge';

export default function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/pages/${id}`)
      .then(r => r.json() as Promise<any>)
      .then(d => setPage(d.page))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading page…</div>;
  if (!page) return <div style={{ padding: '2rem', color: 'var(--danger)' }}>Page not found.</div>;

  return (
    <PageForm
      mode="edit"
      initialData={{
        id: page.id,
        title: page.title,
        content: page.content,
        status: page.status,
        showInNav: page.showInNav,
        navOrder: page.navOrder,
      }}
    />
  );
}
