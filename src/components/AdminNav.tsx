'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, FileText, BookOpen, FolderOpen, Tags, MessageSquare,
  Image as ImageIcon, Users, LogOut, Pen, ChevronLeft, ChevronRight, Settings
} from 'lucide-react';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/posts', icon: FileText, label: 'Posts' },
  { href: '/admin/pages', icon: BookOpen, label: 'Pages' },
  { href: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  { href: '/admin/tags', icon: Tags, label: 'Tags' },
  { href: '/admin/comments', icon: MessageSquare, label: 'Comments' },
  { href: '/admin/media', icon: ImageIcon, label: 'Media' },
  { href: '/admin/users', icon: Users, label: 'Users' },
];

export function AdminNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <aside style={{
      width: collapsed ? 64 : 240,
      minHeight: '100vh',
      background: '#13131f',
      borderRight: '1px solid #1e1e32',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '1.25rem 0' : '1.25rem 1.25rem',
        borderBottom: '1px solid #1e1e32',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: '0.5rem',
      }}>
        {!collapsed && (
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #6d28d9, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pen size={15} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white', letterSpacing: '-0.02em' }}>Torque</span>
          </Link>
        )}
        {collapsed && (
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #6d28d9, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pen size={15} color="white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: '#1e1e32', border: 'none', borderRadius: 6, padding: '0.25rem',
            color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center',
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '0.75rem 0.625rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(({ href, icon: Icon, label, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: collapsed ? '0.75rem' : '0.625rem 0.875rem',
                borderRadius: 8,
                textDecoration: 'none',
                color: active ? 'white' : '#9ca3af',
                background: active ? 'rgba(109,40,217,0.25)' : 'transparent',
                fontWeight: active ? 600 : 400,
                fontSize: '0.875rem',
                transition: 'all 0.15s ease',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
              }}
            >
              <Icon size={18} style={{ flexShrink: 0, color: active ? '#a78bfa' : 'inherit' }} />
              {!collapsed && <span>{label}</span>}
              {active && (
                <div style={{
                  position: 'absolute', left: 0, top: '20%', bottom: '20%',
                  width: 3, borderRadius: '0 3px 3px 0',
                  background: '#8b5cf6',
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{ padding: '0.75rem 0.625rem', borderTop: '1px solid #1e1e32', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Link href="/admin/settings" style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: collapsed ? '0.75rem' : '0.625rem 0.875rem',
          borderRadius: 8, textDecoration: 'none', color: '#9ca3af',
          fontSize: '0.875rem', transition: 'color 0.15s ease',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <Settings size={18} />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: collapsed ? '0.75rem' : '0.625rem 0.875rem',
            borderRadius: 8, background: 'none', border: 'none',
            color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem',
            transition: 'background 0.15s ease',
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: '100%',
          }}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
