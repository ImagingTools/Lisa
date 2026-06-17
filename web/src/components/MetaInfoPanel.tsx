function fmt(ts: string | undefined) {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

/**
 * Renders the audit/system block for a document item.
 * 
 * Updated to work with ImtCore SDL list item types (ProductItem, LicenseItem,
 * FeatureItem, UserItemData) which have `id`, `typeId`, `added`, and
 * `timeStamp`/`lastModified` fields directly on them (not nested in meta).
 */
export function MetaInfoPanel({ item }: { item?: MetaItem | null }) {
  if (!item) return null;
  return (
    <dl className="meta-grid" aria-label="Document metadata">
      <dt>ID</dt>
      <dd>
        <code>{item.id}</code>
      </dd>
      <dt>Type</dt>
      <dd>{item.typeId}</dd>
      {item.added && (
        <>
          <dt>Created</dt>
          <dd>{fmt(item.added)}</dd>
        </>
      )}
      {(item.timeStamp || item.lastModified) && (
        <>
          <dt>Last modified</dt>
          <dd>{fmt(item.timeStamp ?? item.lastModified)}</dd>
        </>
      )}
    </dl>
  );
}

/** Items that can be displayed in MetaInfoPanel */
export type MetaItem = {
  id: string;
  typeId: string;
  added?: string;
  timeStamp?: string;
  lastModified?: string;
};
