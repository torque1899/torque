// src/app/(blog)/register/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pen, Mail, Lock, User } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json() as any;
      if (!res.ok) { setError(data.error || 'Registration failed'); return; }
      router.push('/');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg-secondary) 100%)' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #6d28d9, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Pen size={26} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Create account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join Torque and start reading</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && (
            <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, color: '#991b1b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input id="name" className="form-input" style={{ paddingLeft: '2.5rem' }} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Jane Doe" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input id="reg-email" type="email" className="form-input" style={{ paddingLeft: '2.5rem' }} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@example.com" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input id="reg-password" type="password" className="form-input" style={{ paddingLeft: '2.5rem' }} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min. 8 characters" required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
