'use client';
import { useEffect, useState } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const saved = localStorage.getItem('torque-theme') || 'light';
    document.documentElement.classList.toggle('dark', saved === 'dark');
  }, []);

  if (!mounted) return <>{children}</>;
  return <>{children}</>;
}

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = (localStorage.getItem('torque-theme') as 'light' | 'dark') || 'light';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(saved);
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('torque-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return { theme, toggle };
}
