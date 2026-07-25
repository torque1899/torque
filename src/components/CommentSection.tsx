'use client';
import { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Clock } from 'lucide-react';

interface Comment {
  id: number;
  content: string;
  authorName: string;
  createdAt: string | number;
  parentId: number | null;
}

function formatDate(d: any) {
  return new Date(typeof d === 'number' ? d * 1000 : d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [form, setForm] = useState({ name: '', email: '', content: '', parentId: null as number | null });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}&status=approved`)
      .then(r => r.json() as Promise<any>)
      .then(d => setComments(d.comments || []))
      .catch(() => {});
  }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.content) return;
    setSubmitting(true);
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, postId, parentId: replyTo }),
      });
      setForm({ name: '', email: '', content: '', parentId: null });
      setReplyTo(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const topLevel = comments.filter(c => !c.parentId);
  const replies = (parentId: number) => comments.filter(c => c.parentId === parentId);

  return (
    <section style={{ marginTop: '3rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MessageSquare size={20} style={{ color: 'var(--accent)' }} />
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </h2>

      {/* Comments list */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {topLevel.map(comment => (
          <div key={comment.id}>
            <CommentItem comment={comment} onReply={() => setReplyTo(comment.id)} />
            {replies(comment.id).map(reply => (
              <div key={reply.id} style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <CommentItem comment={reply} onReply={() => setReplyTo(comment.id)} />
              </div>
            ))}
          </div>
        ))}
        {topLevel.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Be the first to comment!</p>
        )}
      </div>

      {/* Comment form */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>
          {replyTo ? `Replying to comment #${replyTo}` : 'Leave a Comment'}
          {replyTo && (
            <button onClick={() => setReplyTo(null)} style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Cancel reply
            </button>
          )}
        </h3>
        {success && (
          <div style={{ padding: '0.75rem 1rem', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 8, color: '#065f46', fontSize: '0.875rem', marginBottom: '1rem' }}>
            ✓ Comment submitted! It will appear after moderation.
          </div>
        )}
        <form onSubmit={submit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Name *</label>
              <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Your name" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="your@email.com" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Comment *</label>
            <textarea className="form-textarea" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required placeholder="Share your thoughts…" rows={4} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            <Send size={15} /> {submitting ? 'Submitting…' : 'Post Comment'}
          </button>
        </form>
      </div>
    </section>
  );
}

function CommentItem({ comment, onReply }: { comment: Comment; onReply: () => void }) {
  return (
    <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '1rem' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6d28d9, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <User size={18} color="white" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
          <strong style={{ fontSize: '0.875rem', fontWeight: 600 }}>{comment.authorName}</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={11} /> {formatDate(comment.createdAt)}
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.5rem' }}>{comment.content}</p>
        <button onClick={onReply} style={{ fontSize: '0.75rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Reply</button>
      </div>
    </div>
  );
}
