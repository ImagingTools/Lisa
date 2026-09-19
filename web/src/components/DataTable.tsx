/**
 * Generic data table with:
 *  - sortable columns (click header → asc → desc → none)
 *  - resizable columns (drag the right edge of a header)
 *  - drag-to-reorder columns (drag a header onto another header)
 *  - row selection + double-click "activate" (used to open editor tabs)
 *
 * Per-table view state (column order, widths, sort) is persisted to
 * `localStorage` under the `tableId` so users get the same layout back on
 * reload — the same behaviour the QML `MultiDocCollectionView` gets via
 * Acf `Settings`.
 *
 * Implemented with native DOM events / HTML5 drag-and-drop to avoid a
 * heavyweight grid dependency.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type ReactNode,
} from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface Column<T> {
  /** Stable column key. Used to identify the column in persisted layout. */
  key: string;
  /** Header label. */
  header: ReactNode;
  /** Cell renderer. */
  cell: (row: T) => ReactNode;
  /**
   * Comparable value extractor used for sorting. If omitted, sorting on
   * this column is disabled.
   */
  sortValue?: (row: T) => string | number | null | undefined;
  /** Default width in pixels. */
  width?: number;
  /** Minimum width in pixels (default 60). */
  minWidth?: number;
}

export interface DataTableProps<T> {
  /** Stable id used to scope persisted layout (column order/widths/sort). */
  tableId: string;
  columns: Column<T>[];
  rows: T[];
  /** Stable row identifier — used for selection and React keys. */
  rowKey: (row: T) => string;
  selectedKey?: string | null;
  onSelect?: (row: T) => void;
  /** Called on double-click / Enter on a row — used to open the editor tab. */
  onActivate?: (row: T) => void;
  /** Custom message shown when `rows.length === 0`. */
  emptyMessage?: ReactNode;
  ariaLabel?: string;
}

interface SortState {
  key: string;
  dir: 'asc' | 'desc';
}

interface Layout {
  /** Column keys in display order. */
  order: string[];
  /** Column widths (px) keyed by column key. */
  widths: Record<string, number>;
  sort: SortState | null;
}

function defaultLayout<T>(columns: Column<T>[]): Layout {
  return {
    order: columns.map((c) => c.key),
    widths: Object.fromEntries(
      columns.map((c) => [c.key, c.width ?? 160]),
    ),
    sort: null,
  };
}

export function DataTable<T>({
  tableId,
  columns,
  rows,
  rowKey,
  selectedKey = null,
  onSelect,
  onActivate,
  emptyMessage = 'No items.',
  ariaLabel,
}: DataTableProps<T>) {
  const initial = useMemo(() => defaultLayout(columns), [columns]);
  const [layout, setLayout] = useLocalStorage<Layout>(
    `lisa-web.table.${tableId}.v1`,
    initial,
  );

  // Reconcile persisted layout with the current column definition: drop
  // stale keys, append new ones, fall back to defaults for missing widths.
  const reconciled = useMemo<Layout>(() => {
    const known = new Set(columns.map((c) => c.key));
    const order = layout.order.filter((k) => known.has(k));
    for (const c of columns) if (!order.includes(c.key)) order.push(c.key);
    const widths: Record<string, number> = {};
    for (const c of columns) {
      widths[c.key] = layout.widths[c.key] ?? c.width ?? 160;
    }
    const sort =
      layout.sort && known.has(layout.sort.key) ? layout.sort : null;
    return { order, widths, sort };
  }, [layout, columns]);

  const orderedColumns = useMemo(
    () =>
      reconciled.order
        .map((k) => columns.find((c) => c.key === k))
        .filter((c): c is Column<T> => !!c),
    [reconciled.order, columns],
  );

  // ---------- Sort ----------
  const sortedRows = useMemo(() => {
    if (!reconciled.sort) return rows;
    const col = columns.find((c) => c.key === reconciled.sort!.key);
    if (!col?.sortValue) return rows;
    const dir = reconciled.sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = col.sortValue!(a);
      const vb = col.sortValue!(b);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }, [rows, reconciled.sort, columns]);

  const cycleSort = useCallback(
    (key: string) => {
      setLayout((prev) => {
        const cur = prev.sort && prev.sort.key === key ? prev.sort : null;
        let next: SortState | null;
        if (!cur) next = { key, dir: 'asc' };
        else if (cur.dir === 'asc') next = { key, dir: 'desc' };
        else next = null;
        return { ...prev, sort: next };
      });
    },
    [setLayout],
  );

  // ---------- Resize ----------
  const resizeRef = useRef<{ key: string; startX: number; startWidth: number } | null>(
    null,
  );

  const onResizeMove = useCallback(
    (e: MouseEvent) => {
      const r = resizeRef.current;
      if (!r) return;
      const col = columns.find((c) => c.key === r.key);
      const min = col?.minWidth ?? 60;
      const next = Math.max(min, r.startWidth + (e.clientX - r.startX));
      setLayout((prev) => ({
        ...prev,
        widths: { ...prev.widths, [r.key]: next },
      }));
    },
    [columns, setLayout],
  );

  const onResizeUp = useCallback(() => {
    resizeRef.current = null;
    window.removeEventListener('mousemove', onResizeMove);
    window.removeEventListener('mouseup', onResizeUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [onResizeMove]);

  const beginResize = useCallback(
    (key: string, startX: number) => {
      resizeRef.current = {
        key,
        startX,
        startWidth: reconciled.widths[key],
      };
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', onResizeMove);
      window.addEventListener('mouseup', onResizeUp);
    },
    [reconciled.widths, onResizeMove, onResizeUp],
  );

  useEffect(
    () => () => {
      // Clean up if the component unmounts mid-drag.
      window.removeEventListener('mousemove', onResizeMove);
      window.removeEventListener('mouseup', onResizeUp);
    },
    [onResizeMove, onResizeUp],
  );

  // ---------- Reorder (drag headers) ----------
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const onHeaderDragStart = (e: DragEvent<HTMLTableCellElement>, key: string) => {
    setDragKey(key);
    e.dataTransfer.effectAllowed = 'move';
    // Some browsers require setData to actually start a drag.
    e.dataTransfer.setData('text/plain', key);
  };

  const onHeaderDragOver = (e: DragEvent<HTMLTableCellElement>, key: string) => {
    if (!dragKey || dragKey === key) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropTarget !== key) setDropTarget(key);
  };

  const onHeaderDrop = (e: DragEvent<HTMLTableCellElement>, key: string) => {
    e.preventDefault();
    if (!dragKey || dragKey === key) {
      setDragKey(null);
      setDropTarget(null);
      return;
    }
    setLayout((prev) => {
      const order = [...prev.order];
      const from = order.indexOf(dragKey);
      const to = order.indexOf(key);
      if (from < 0 || to < 0) return prev;
      order.splice(from, 1);
      order.splice(to, 0, dragKey);
      return { ...prev, order };
    });
    setDragKey(null);
    setDropTarget(null);
  };

  const onHeaderDragEnd = () => {
    setDragKey(null);
    setDropTarget(null);
  };

  return (
    <div className="data-table-wrap">
      <table
        className="data-table"
        aria-label={ariaLabel}
        style={{ tableLayout: 'fixed' }}
      >
        <colgroup>
          {orderedColumns.map((c) => (
            <col key={c.key} style={{ width: reconciled.widths[c.key] }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {orderedColumns.map((c) => {
              const sortable = !!c.sortValue;
              const isSorted = reconciled.sort?.key === c.key;
              const dir = isSorted ? reconciled.sort!.dir : null;
              const headerStyle: CSSProperties = {
                cursor: sortable ? 'pointer' : 'default',
              };
              return (
                <th
                  key={c.key}
                  draggable
                  onDragStart={(e) => onHeaderDragStart(e, c.key)}
                  onDragOver={(e) => onHeaderDragOver(e, c.key)}
                  onDrop={(e) => onHeaderDrop(e, c.key)}
                  onDragEnd={onHeaderDragEnd}
                  className={[
                    dropTarget === c.key ? 'is-drop-target' : '',
                    dragKey === c.key ? 'is-dragging' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-sort={
                    isSorted ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'
                  }
                >
                  <span
                    className="data-table__header-label"
                    style={headerStyle}
                    onClick={() => sortable && cycleSort(c.key)}
                    role={sortable ? 'button' : undefined}
                    tabIndex={sortable ? 0 : -1}
                    onKeyDown={(e) => {
                      if (sortable && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        cycleSort(c.key);
                      }
                    }}
                  >
                    {c.header}
                    {isSorted && (
                      <span className="data-table__sort-indicator" aria-hidden="true">
                        {dir === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </span>
                  <span
                    className="data-table__resizer"
                    role="separator"
                    aria-orientation="vertical"
                    aria-label={`Resize column ${typeof c.header === 'string' ? c.header : c.key}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      beginResize(c.key, e.clientX);
                    }}
                    // Headers are draggable; prevent the resizer from starting
                    // a column-reorder drag.
                    draggable
                    onDragStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  />
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <td
                colSpan={orderedColumns.length}
                className="data-table__empty"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedRows.map((row) => {
              const k = rowKey(row);
              const selected = selectedKey === k;
              return (
                <tr
                  key={k}
                  className={selected ? 'is-selected' : ''}
                  onClick={() => onSelect?.(row)}
                  onDoubleClick={() => onActivate?.(row)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onActivate?.(row);
                  }}
                  tabIndex={0}
                >
                  {orderedColumns.map((c) => (
                    <td key={c.key} title={typeof c.header === 'string' ? undefined : undefined}>
                      <div className="data-table__cell">{c.cell(row)}</div>
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
