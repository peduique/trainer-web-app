'use client';

import { useEffect } from 'react';
import { useSettings } from '@/features/settings/hooks/use-settings';

/** Applies theme from settings to document.documentElement so Tailwind dark: and CSS .dark work. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  useEffect(() => {
    const handler = (e: CustomEvent<'light' | 'dark'>) => {
      document.documentElement.classList.toggle('dark', e.detail === 'dark');
    };
    window.addEventListener('theme-change', handler as EventListener);
    return () => window.removeEventListener('theme-change', handler as EventListener);
  }, []);

  return <>{children}</>;
}
