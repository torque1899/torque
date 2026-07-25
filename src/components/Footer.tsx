import Link from 'next/link';
import { Pen, Rss } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      padding: '3rem 0 2rem',
      marginTop: '4rem',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '0.75rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #6d28d9, #a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Pen size={15} color="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>Torque</span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              A modern blogging platform built for speed and simplicity.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/" style={footerLinkStyle}>Home</Link>
              <Link href="/login" style={footerLinkStyle}>Sign In</Link>
              <Link href="/register" style={footerLinkStyle}>Register</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Connect</h4>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {/* Twitter */}
              <a href="#" aria-label="Twitter" style={iconLinkStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              {/* GitHub */}
              <a href="#" aria-label="GitHub" style={iconLinkStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              {/* RSS */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/api/feed" aria-label="RSS" style={iconLinkStyle}>
                <Rss size={16} />
              </a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Torque. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Built with Next.js & Cloudflare
          </p>
        </div>
      </div>
    </footer>
  );
}

const footerLinkStyle: React.CSSProperties = {
  color: 'var(--text-muted)',
  textDecoration: 'none',
  fontSize: '0.875rem',
  transition: 'color 0.2s ease',
};

const iconLinkStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 8,
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-muted)',
  transition: 'all 0.2s ease',
  textDecoration: 'none',
};
