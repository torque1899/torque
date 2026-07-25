// src/app/(blog)/layout.tsx
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

async function getNavPages() {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/pages?nav=true`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json() as any;
    return data.pages || [];
  } catch {
    return [];
  }
}

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const navPages = await getNavPages();
  return (
    <>
      <Header navPages={navPages} />
      <main style={{ minHeight: 'calc(100vh - 140px)' }}>{children}</main>
      <Footer />
    </>
  );
}
