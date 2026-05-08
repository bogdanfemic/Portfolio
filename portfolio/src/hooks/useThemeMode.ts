import { useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getSystemMode(): ThemeMode {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function normalizeMode(value: unknown): ThemeMode | null {
  return value === 'light' || value === 'dark' ? value : null;
}

export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = normalizeMode(window.localStorage.getItem(STORAGE_KEY));
    return saved ?? getSystemMode();
  });

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mediaQuery) return;
    const onChange = () => {
      const saved = normalizeMode(window.localStorage.getItem(STORAGE_KEY));
      if (saved) return;
      setMode(getSystemMode());
    };

    mediaQuery.addEventListener?.('change', onChange);
    // Safari < 14
    mediaQuery.addListener?.(onChange);
    return () => {
      mediaQuery.removeEventListener?.('change', onChange);
      mediaQuery.removeListener?.(onChange);
    };
  }, []);

  const toggle = useMemo(
    () => () => setMode(prev => (prev === 'dark' ? 'light' : 'dark')),
    []
  );

  return { mode, setMode, toggle };
}

