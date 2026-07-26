'use client';
import { useEffect, useState } from 'react';
import PostForm from '@/components/PostForm';
import { use } from 'react';

export const runtime = 'edge';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(r => r.json() as Promise<any>)
      .then(d => setPost(d.post))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading post…</div>;
  if (!post) return <div style={{ padding: '2rem', color: 'var(--danger)' }}>Post not found.</div>;

  return (
    <PostForm
      mode="edit"
      initialData={{
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        status: post.status,
        categoryIds: post.categories?.map((c: any) => c.id) || [],
        tagIds: post.tags?.map((t: any) => t.id) || [],
      }}
    />
  );
}
