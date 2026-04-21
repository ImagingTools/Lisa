import type { DocumentMetaInfo } from '@/types/domain';

function fmt(ts: string | undefined) {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

/**
 * Renders the audit/system block for a document. Mirrors the
 * `MetaInfo` panel that QML's `MultiDocCollectionPage` shows when
 * `visibleMetaInfo` is true.
 */
export function MetaInfoPanel({ meta }: { meta?: DocumentMetaInfo | null }) {
  if (!meta) return null;
  return (
    <dl className="meta-grid" aria-label="Document metadata">
      <dt>UUID</dt>
      <dd>
        <code>{meta.uuid}</code>
      </dd>
      <dt>Type</dt>
      <dd>{meta.typeId}</dd>
      <dt>Revision</dt>
      <dd>{meta.revision}</dd>
      <dt>Created</dt>
      <dd>{fmt(meta.created)}</dd>
      <dt>Last modified</dt>
      <dd>{fmt(meta.lastModified)}</dd>
      <dt>Owner</dt>
      <dd>{meta.owner ?? '—'}</dd>
    </dl>
  );
}
