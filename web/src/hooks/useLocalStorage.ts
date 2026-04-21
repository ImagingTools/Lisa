import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * `useState`-shaped hook that persists its value to `localStorage`.
 *
 * Used across the app for UI preferences that must survive a reload —
 * sidebar collapse state, per-table column order/widths/sort, open editor
 * tabs, etc. Mirrors the `Settings`-backed view state stored by
 * `MultiDocCollectionPage.qml` on the QML side.
 */
export function useLocalStorage<T>(
  key: string,
  initial: T | (() => T),
): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return typeof initial === 'function' ? (initial as () => T)() : initial;
    }
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw) as T;
    } catch {
      /* ignore — fall through to initial */
    }
    return typeof initial === 'function' ? (initial as () => T)() : initial;
  });

  // Keep the latest key in a ref so the setter identity is stable.
  const keyRef = useRef(key);
  keyRef.current = key;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(keyRef.current, JSON.stringify(value));
    } catch {
      /* quota / serialization failure — ignore */
    }
  }, [value]);

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) =>
      typeof next === 'function' ? (next as (p: T) => T)(prev) : next,
    );
  }, []);

  return [value, set];
}
