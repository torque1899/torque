'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { AlertTicker } from './AlertTicker';
import Image from 'next/image';

interface NavPage {
  title: string;
  slug: string;
}

export function Header({ navPages = [] }: { navPages?: NavPage[] }) {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => (r.ok ? r.json() : null) as Promise<any>)
      .then(d => d && setUser(d.user))
      .catch(() => {});
  }, []);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'var(--bg-card)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      boxShadow: scrolled ? 'var(--shadow)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.5rem' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Image src="/favicon.webp" alt="Logo" width={32} height={32} style={{ objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Torque
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
          <Link href="/" style={navLinkStyle}>Home</Link>
          {navPages.map(p => (
            <Link key={p.slug} href={`/${p.slug}`} style={navLinkStyle}>{p.title}</Link>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={toggle} className="btn btn-secondary btn-sm" style={{ padding: '0.375rem' }} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {user ? (
            <Link href="/admin" className="btn btn-primary btn-sm">Dashboard</Link>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">Sign In</Link>
          )}
          <button onClick={() => setOpen(!open)} className="mobile-menu-btn" style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'none' }} aria-label="Toggle menu navigation drawer">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <Link href="/" style={mobileNavStyle} onClick={() => setOpen(false)}>Home</Link>
          {navPages.map(p => (
            <Link key={p.slug} href={`/${p.slug}`} style={mobileNavStyle} onClick={() => setOpen(false)}>{p.title}</Link>
          ))}
        </div>
      )}

      <AlertTicker />

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

const navLinkStyle: React.CSSProperties = {
  padding: '0.5rem 0.875rem',
  borderRadius: 8,
  color: 'var(--text-muted)',
  fontWeight: 500,
  fontSize: '0.9rem',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
};

const mobileNavStyle: React.CSSProperties = {
  display: 'block',
  padding: '0.75rem 0',
  color: 'var(--text)',
  fontWeight: 500,
  textDecoration: 'none',
  borderBottom: '1px solid var(--border)',
};
