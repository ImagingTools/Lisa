/**
 * Theme provider — toggles `data-theme="dark"` on the document root.
 *
 * Conceptually replaces the QML `designProvider.setDesignSchema(...)` call
 * in `LisaWeb.qml`.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type ThemeName = 'light' | 'dark';

interface ThemeCtx {
  theme: ThemeName;
  toggle: () => void;
  setTheme: (t: ThemeName) => void;
}

const Ctx = createContext<ThemeCtx | undefined>(undefined);
const STORAGE_KEY = 'lisa-web.theme';

function readInitialTheme(): ThemeName {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeName | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(readInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
