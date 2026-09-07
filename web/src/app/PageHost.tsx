/**
 * `PageHost` — generic route component for a page selected by its `pageId`.
 *
 * On mount it relies on the cached `PagesData` query (already kicked off by
 * `AppShell`) to look up the page descriptor, then resolves:
 *   * the page-shell component (`source`     → `pageRegistry.resolvePageShell`)
 *   * the page-content component (`startItem` → `pageRegistry.resolvePageContent`)
 *
 * and renders `<Shell>{<Content/>}</Shell>` — exactly the indirection the QML
 * `PagesDataController` performs when a sidebar entry is activated.
 */
import { useQuery } from '@apollo/client';
import { Navigate, useParams } from 'react-router-dom';
import { PAGES_DATA_QUERY } from '@/api/graphql/operations';
import type { PageDataItem, PagesDataPayload } from '@/types/domain';
import { CenteredSpinner } from '@/components/feedback/CenteredSpinner';
import { EmptyState } from '@/components/feedback/EmptyState';
import { resolvePageContent, resolvePageShell } from '@/app/pageRegistry';

interface PagesDataResult {
  PagesData: PagesDataPayload;
}

export function PageHost() {
  const { pageId } = useParams<{ pageId: string }>();
  const { data, loading, error } = useQuery<PagesDataResult>(PAGES_DATA_QUERY, {
    fetchPolicy: 'cache-first',
  });

  if (loading && !data) return <CenteredSpinner label="Loading pages…" />;
  if (error) {
    return (
      <EmptyState
        title="Could not load pages"
        message={error.message}
      />
    );
  }

  const items = data?.PagesData?.items ?? [];
  const page: PageDataItem | undefined = items.find((p) => p.id === pageId);

  if (!page) {
    const fallback = items.find((p) => p.visible !== false);
    if (fallback && fallback.id !== pageId) {
      return <Navigate to={`/${fallback.id}`} replace />;
    }
    return <EmptyState title="Page not found" message={`No page descriptor for '${pageId}'.`} />;
  }

  const Content = resolvePageContent(page.startItem);
  const Shell = resolvePageShell(page.source);

  if (!Content) {
    return (
      <EmptyState
        title={page.name ?? page.id}
        message={`No React component is registered for '${page.startItem ?? '(no startItem)'}'.`}
      />
    );
  }

  return (
    <Shell title={page.name}>
      <Content />
    </Shell>
  );
}
