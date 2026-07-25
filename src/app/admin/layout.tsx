// src/app/admin/layout.tsx
import { AdminNav } from '@/components/AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <AdminNav />
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
        {children}
      </main>
    </div>
  );
}
