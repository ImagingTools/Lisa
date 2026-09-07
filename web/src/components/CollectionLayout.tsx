/**
 * Shared collection-page shell.
 *
 * Encapsulates the two-column layout used by every list-based feature page
 * (Products, Licenses, Accounts — see also the QML `MultiDocCollectionPage`):
 *
 *     ┌─────────────────────── toolbar / + New ────────────────────────┐
 *     │ [ error banner (optional) ]                                     │
 *     ├──────────────────────────────┬──────────────────────────────────┤
 *     │   DataTable (sortable,       │   Details side panel             │
 *     │   resizable, drag-to-reorder)│   (Meta-Info or custom content)  │
 *     │                              │                                  │
 *     │ hint                         │                                  │
 *     └──────────────────────────────┴──────────────────────────────────┘
 *
 * Pages compose this with their own column descriptors, toolbar and details
 * renderer — they no longer need to duplicate the grid/panel markup.
 */
import type { ReactNode } from 'react';
import { DataTable, type Column } from './DataTable';

export interface CollectionLayoutProps<T> {
  /** Contents of the page header row (title, search, filters, `+ New`, …). */
  toolbar: ReactNode;
  /** Optional error banner text; shown with a `Retry` button if `onRetry` is set. */
  error?: string;
  onRetry?: () => void;

  /** DataTable wiring. */
  tableId: string;
  ariaLabel: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onActivate: (row: T) => void;
  emptyMessage?: string;

  /** Selected row (controlled). */
  selectedKey: string | null;
  onSelect: (row: T) => void;

  /** Contents of the right-hand details panel for the currently selected row. */
  renderDetails: (selected: T | null) => ReactNode;
  /** Title for the details panel. Defaults to `"Meta info"`. */
  detailsTitle?: string;
  /**
   * Hint shown under the DataTable.
   * Defaults to "Double-click a row (or press Enter) to open the editor in a new tab."
   */
  hint?: string;
}

const DEFAULT_HINT =
  'Double-click a row (or press Enter) to open the editor in a new tab.';

export function CollectionLayout<T>({
  toolbar,
  error,
  onRetry,
  tableId,
  ariaLabel,
  columns,
  rows,
  rowKey,
  onActivate,
  emptyMessage,
  selectedKey,
  onSelect,
  renderDetails,
  detailsTitle = 'Meta info',
  hint = DEFAULT_HINT,
}: CollectionLayoutProps<T>) {
  const selected =
    selectedKey === null ? null : rows.find((r) => rowKey(r) === selectedKey) ?? null;

  return (
    <>
      <div className="page-header">{toolbar}</div>

      {error && (
        <div className="error-banner" role="alert">
          {error}
          {onRetry && (
            <>
              {' '}
              <button className="btn btn--small" onClick={onRetry}>
                Retry
              </button>
            </>
          )}
        </div>
      )}

      <div className="collection-layout">
        <div className="panel" style={{ padding: 0 }}>
          <DataTable<T>
            tableId={tableId}
            ariaLabel={ariaLabel}
            columns={columns}
            rows={rows}
            rowKey={rowKey}
            selectedKey={selectedKey}
            onSelect={onSelect}
            onActivate={onActivate}
            emptyMessage={emptyMessage}
          />
          <div className="collection-layout__hint">{hint}</div>
        </div>
        <div className="panel">
          <h3 className="panel__title" style={{ marginBottom: 'var(--margin-m)' }}>
            {detailsTitle}
          </h3>
          {renderDetails(selected)}
        </div>
      </div>
    </>
  );
}
