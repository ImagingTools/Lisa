/**
 * `PageTabs` — top-level tab strip for a feature page.
 *
 * The first tab is always the "collection" view (non-closable, like an
 * IDE's main project view). Editor tabs are opened on demand, e.g. when
 * the user double-clicks a row in the collection table or presses
 * "+ New …" in the toolbar. Closing an editor tab returns focus to the
 * previously active tab.
 *
 * The tabs themselves are managed via `usePageTabs` — pages render the
 * collection content for `'collection'` and look up their own editor tabs
 * for the rest. Open tab metadata is persisted to `localStorage` so tabs
 * survive a reload (their content is re-rendered fresh from props).
 */
import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface TabDescriptor {
  /** Stable id, e.g. `editor:RTVision` or `new:product`. */
  id: string;
  title: string;
  /** Optional subtitle shown muted in the tab. */
  subtitle?: string;
  closable?: boolean;
}

export interface PageTabsState {
  tabs: TabDescriptor[];
  activeId: string;
}

export interface PageTabsApi {
  state: PageTabsState;
  /** Open or focus a tab. If a tab with the same id exists, it is reused. */
  openTab: (tab: TabDescriptor) => void;
  /** Close a tab by id (no-op for non-closable tabs). */
  closeTab: (id: string) => void;
  setActive: (id: string) => void;
  /** Update the title of an existing tab in place (e.g. after a save). */
  renameTab: (id: string, patch: Partial<TabDescriptor>) => void;
  /** Replace one tab id with another (used after a "create" tab is saved). */
  replaceTab: (oldId: string, next: TabDescriptor) => void;
}

const COLLECTION_ID = 'collection';

/**
 * Manages tab state for a page. The collection tab is implicit — pages
 * never need to add it themselves.
 */
export function usePageTabs(persistKey: string, collectionTitle: string): PageTabsApi {
  const collectionTab: TabDescriptor = useMemo(
    () => ({ id: COLLECTION_ID, title: collectionTitle, closable: false }),
    [collectionTitle],
  );

  const [persisted, setPersisted] = useLocalStorage<{
    tabs: TabDescriptor[];
    activeId: string;
  }>(`lisa-web.pagetabs.${persistKey}.v1`, {
    tabs: [collectionTab],
    activeId: COLLECTION_ID,
  });

  // Make sure the collection tab is always present and first.
  const state = useMemo<PageTabsState>(() => {
    const rest = persisted.tabs.filter((t) => t.id !== COLLECTION_ID);
    const tabs = [collectionTab, ...rest];
    const activeId = tabs.some((t) => t.id === persisted.activeId)
      ? persisted.activeId
      : COLLECTION_ID;
    return { tabs, activeId };
  }, [persisted, collectionTab]);

  const openTab = useCallback(
    (tab: TabDescriptor) => {
      setPersisted((prev) => {
        const exists = prev.tabs.some((t) => t.id === tab.id);
        const tabs = exists
          ? prev.tabs.map((t) => (t.id === tab.id ? { ...t, ...tab } : t))
          : [...prev.tabs, { closable: true, ...tab }];
        return { tabs, activeId: tab.id };
      });
    },
    [setPersisted],
  );

  const closeTab = useCallback(
    (id: string) => {
      if (id === COLLECTION_ID) return;
      setPersisted((prev) => {
        const idx = prev.tabs.findIndex((t) => t.id === id);
        if (idx < 0) return prev;
        const tabs = prev.tabs.filter((t) => t.id !== id);
        let activeId = prev.activeId;
        if (activeId === id) {
          // Focus the previous neighbour, or fall back to the collection.
          const fallback = prev.tabs[idx - 1] ?? prev.tabs[idx + 1];
          activeId = fallback?.id ?? COLLECTION_ID;
        }
        return { tabs, activeId };
      });
    },
    [setPersisted],
  );

  const setActive = useCallback(
    (id: string) => {
      setPersisted((prev) =>
        prev.activeId === id ? prev : { ...prev, activeId: id },
      );
    },
    [setPersisted],
  );

  const renameTab = useCallback(
    (id: string, patch: Partial<TabDescriptor>) => {
      setPersisted((prev) => ({
        ...prev,
        tabs: prev.tabs.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      }));
    },
    [setPersisted],
  );

  const replaceTab = useCallback(
    (oldId: string, next: TabDescriptor) => {
      setPersisted((prev) => {
        const idx = prev.tabs.findIndex((t) => t.id === oldId);
        if (idx < 0) {
          return {
            tabs: [...prev.tabs, { closable: true, ...next }],
            activeId: next.id,
          };
        }
        const tabs = [...prev.tabs];
        tabs[idx] = { closable: true, ...next };
        return {
          tabs,
          activeId: prev.activeId === oldId ? next.id : prev.activeId,
        };
      });
    },
    [setPersisted],
  );

  return { state, openTab, closeTab, setActive, renameTab, replaceTab };
}

export const COLLECTION_TAB_ID = COLLECTION_ID;

/**
 * Render the tab strip plus the body. The page passes a `renderTab(id)`
 * callback that returns the content for a given tab id (always called for
 * the active tab; inactive tabs are unmounted to keep memory bounded).
 */
export function PageTabs({
  api,
  renderTab,
}: {
  api: PageTabsApi;
  renderTab: (id: string) => ReactNode;
}) {
  const { state, setActive, closeTab } = api;
  // Track tabs that have ever been visited so we can keep their state alive
  // (mounted + display:none) while the user switches between them.
  const [visited, setVisited] = useState<Set<string>>(
    () => new Set([state.activeId]),
  );
  if (!visited.has(state.activeId)) {
    setVisited((prev) => {
      const next = new Set(prev);
      next.add(state.activeId);
      return next;
    });
  }

  return (
    <div className="page-tabs">
      <div className="page-tabs__bar" role="tablist">
        {state.tabs.map((t) => {
          const active = t.id === state.activeId;
          return (
            <div
              key={t.id}
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              className={`page-tabs__tab ${active ? 'is-active' : ''}`}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActive(t.id);
                }
              }}
              title={t.subtitle ? `${t.title} — ${t.subtitle}` : t.title}
            >
              <span className="page-tabs__title">{t.title}</span>
              {t.subtitle && <span className="page-tabs__subtitle">{t.subtitle}</span>}
              {t.closable !== false && t.id !== COLLECTION_ID && (
                <button
                  type="button"
                  aria-label={`Close ${t.title}`}
                  className="page-tabs__close"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(t.id);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="page-tabs__body">
        {state.tabs
          .filter((t) => visited.has(t.id))
          .map((t) => (
            <div
              key={t.id}
              className="page-tabs__panel"
              role="tabpanel"
              hidden={t.id !== state.activeId}
            >
              {renderTab(t.id)}
            </div>
          ))}
      </div>
    </div>
  );
}
