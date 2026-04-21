/**
 * Features / Packages module.
 *
 * QML correspondence:
 *   - `ImtCore/Qml/imtlicgui/FeatureCollectionView.qml` → FeaturesCollection
 *   - `ImtCore/Qml/imtlicgui/FeatureEditor.qml`         → FeatureEditor
 *   - `ImtCore/Qml/imtlicgui/FeaturesDependenciesProvider.qml`
 *
 * Features form a tree (sub-features), so the collection tab uses a tree
 * widget rather than the flat `DataTable` used on the other pages. The
 * tab strip + per-row Meta-Info panel and "double-click opens editor in a
 * new tab" workflow mirror the other pages.
 *
 * Operations: PackagesList / FeatureAdd / FeatureUpdate / FeatureRemove.
 */
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  FEATURE_ADD,
  FEATURE_REMOVE,
  FEATURE_UPDATE,
  PACKAGES_LIST,
} from '@/api/graphql/operations';
import type { Feature, FeaturePackage } from '@/types/domain';
import { useSession } from '@/auth/SessionContext';
import { CenteredSpinner } from '@/components/feedback/CenteredSpinner';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { COLLECTION_TAB_ID, PageTabs, usePageTabs } from '@/components/PageTabs';

interface PackagesListData {
  packagesList: FeaturePackage[];
}

interface SelectedNode {
  feature: Feature;
  packageId: string;
  parentUuid: string | null;
}

const editorTabId = (uuid: string) => `editor:${uuid}`;
const NEW_TAB_PREFIX = 'new:';

interface NewState {
  packageId: string;
  parentUuid: string | null;
}

export function FeaturesPage() {
  const { hasPermission } = useSession();
  const { data, loading, error, refetch } =
    useQuery<PackagesListData>(PACKAGES_LIST);
  const tabs = usePageTabs('features', 'Features');
  // Pending "new feature" tabs are keyed by `new:<packageId>:<parentUuid|root>`
  // and we keep the create-context here so the editor knows where to insert.
  const [newStates, setNewStates] = useState<Record<string, NewState>>({});

  if (loading && !data) return <CenteredSpinner label="Loading features…" />;
  const packages = data?.packagesList ?? [];

  const findNode = (uuid: string): SelectedNode | null => {
    for (const pkg of packages) {
      for (const f of pkg.features) {
        const found = walk(f, pkg.id, null, uuid);
        if (found) return found;
      }
    }
    return null;
  };

  const openCreate = (packageId: string, parentUuid: string | null) => {
    const id = `${NEW_TAB_PREFIX}${packageId}:${parentUuid ?? 'root'}`;
    setNewStates((prev) => ({ ...prev, [id]: { packageId, parentUuid } }));
    tabs.openTab({
      id,
      title: parentUuid ? 'New sub-feature' : 'New feature',
      subtitle: packageId,
    });
  };

  return (
    <PageTabs
      api={tabs}
      renderTab={(tabId) => {
        if (tabId === COLLECTION_TAB_ID) {
          return (
            <FeaturesCollection
              packages={packages}
              error={error?.message}
              onRetry={() => refetch()}
              canAdd={hasPermission('AddFeature')}
              onActivate={(node) =>
                tabs.openTab({
                  id: editorTabId(node.feature.uuid),
                  title: node.feature.featureName,
                  subtitle: node.feature.featureId,
                })
              }
              onAddRoot={(packageId) => openCreate(packageId, null)}
            />
          );
        }
        if (tabId.startsWith(NEW_TAB_PREFIX)) {
          const ns = newStates[tabId];
          if (!ns) {
            return (
              <EmptyState
                title="Tab restored"
                message="This 'new feature' tab was restored from a previous session. Close it and create a new one."
              />
            );
          }
          return (
            <FeatureEditor
              key={tabId}
              packages={packages}
              state={{ mode: 'create', ...ns }}
              onClose={() => tabs.closeTab(tabId)}
              onSaved={(node) => {
                setNewStates((prev) => {
                  const next = { ...prev };
                  delete next[tabId];
                  return next;
                });
                tabs.replaceTab(tabId, {
                  id: editorTabId(node.feature.uuid),
                  title: node.feature.featureName,
                  subtitle: node.feature.featureId,
                  closable: true,
                });
              }}
            />
          );
        }
        if (!tabId.startsWith('editor:')) return null;
        const uuid = tabId.slice('editor:'.length);
        const node = findNode(uuid);
        if (!node) {
          return (
            <EmptyState
              title="Feature not found"
              message="This feature no longer exists. Close this tab to dismiss it."
            />
          );
        }
        return (
          <FeatureEditor
            key={tabId}
            packages={packages}
            state={{ mode: 'edit', node }}
            onClose={() => tabs.closeTab(tabId)}
            onSaved={(saved) =>
              tabs.renameTab(tabId, {
                title: saved.feature.featureName,
                subtitle: saved.feature.featureId,
              })
            }
            onDeleted={() => tabs.closeTab(tabId)}
            onAddSub={(parentUuid) => openCreate(node.packageId, parentUuid)}
          />
        );
      }}
    />
  );
}

function walk(
  feature: Feature,
  packageId: string,
  parentUuid: string | null,
  uuid: string,
): SelectedNode | null {
  if (feature.uuid === uuid) return { feature, packageId, parentUuid };
  for (const c of feature.subFeatures) {
    const r = walk(c, packageId, feature.uuid, uuid);
    if (r) return r;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Collection (tree view + selection meta panel)
// ---------------------------------------------------------------------------

function FeaturesCollection({
  packages,
  error,
  onRetry,
  canAdd,
  onActivate,
  onAddRoot,
}: {
  packages: FeaturePackage[];
  error?: string;
  onRetry: () => void;
  canAdd: boolean;
  onActivate: (n: SelectedNode) => void;
  onAddRoot: (packageId: string) => void;
}) {
  const [selected, setSelected] = useState<SelectedNode | null>(null);

  return (
    <>
      <div className="page-header">
        <h1 style={{ margin: 0 }}>Features &amp; packages</h1>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          Failed to load features: {error}{' '}
          <button className="btn btn--small" onClick={onRetry}>Retry</button>
        </div>
      )}

      <div className="collection-layout">
        <div className="panel" style={{ padding: 'var(--margin-m)' }}>
          {packages.length === 0 ? (
            <EmptyState title="No packages" message="No feature packages defined yet." />
          ) : (
            packages.map((pkg) => (
              <PackageBlock
                key={pkg.id}
                pkg={pkg}
                selectedUuid={selected?.feature.uuid ?? null}
                onSelect={setSelected}
                onActivate={onActivate}
                onAddRoot={() => onAddRoot(pkg.id)}
                canAdd={canAdd}
              />
            ))
          )}
          <div className="collection-layout__hint">
            Double-click a feature (or press Enter) to open the editor in a new tab.
          </div>
        </div>

        <div className="panel">
          <h3 className="panel__title" style={{ marginBottom: 'var(--margin-m)' }}>
            Properties
          </h3>
          {selected ? (
            <FeatureProperties node={selected} />
          ) : (
            <p className="panel__subtitle">Select a feature to see its properties.</p>
          )}
        </div>
      </div>
    </>
  );
}

function FeatureProperties({ node }: { node: SelectedNode }) {
  const { feature, packageId } = node;
  return (
    <>
      <div className="panel__subtitle" style={{ marginBottom: 'var(--margin-m)' }}>
        <strong style={{ color: 'var(--color-text)' }}>{feature.featureName}</strong> ·{' '}
        <code>{feature.featureId}</code>
      </div>
      <dl className="meta-grid">
        <dt>UUID</dt>
        <dd><code>{feature.uuid}</code></dd>
        <dt>Package</dt>
        <dd><code>{packageId}</code></dd>
        <dt>Optional</dt>
        <dd>{feature.optional ? 'Yes' : 'No'}</dd>
        <dt>Permission</dt>
        <dd>{feature.isPermission ? 'Yes' : 'No'}</dd>
        <dt>Dependencies</dt>
        <dd>
          {feature.dependencies.length === 0
            ? '—'
            : feature.dependencies.map((d) => (
                <span key={d} className="tag">{d}</span>
              ))}
        </dd>
        <dt>Sub-features</dt>
        <dd>{feature.subFeatures.length}</dd>
        {feature.description && (
          <>
            <dt>Description</dt>
            <dd>{feature.description}</dd>
          </>
        )}
      </dl>
    </>
  );
}

function PackageBlock({
  pkg,
  selectedUuid,
  onSelect,
  onActivate,
  onAddRoot,
  canAdd,
}: {
  pkg: FeaturePackage;
  selectedUuid: string | null;
  onSelect: (n: SelectedNode) => void;
  onActivate: (n: SelectedNode) => void;
  onAddRoot: () => void;
  canAdd: boolean;
}) {
  return (
    <div style={{ marginBottom: 'var(--margin-l)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <strong>{pkg.name}</strong>{' '}
          <span className="panel__subtitle"><code>{pkg.id}</code></span>
          {pkg.description && (
            <div className="panel__subtitle">{pkg.description}</div>
          )}
        </div>
        <button
          type="button"
          className="btn btn--small"
          onClick={onAddRoot}
          disabled={!canAdd}
          title={canAdd ? undefined : 'Requires AddFeature'}
        >
          + Feature
        </button>
      </div>
      {pkg.features.length === 0 ? (
        <div className="panel__subtitle" style={{ paddingLeft: 'var(--margin-l)' }}>
          No features.
        </div>
      ) : (
        <ul className="feature-tree">
          {pkg.features.map((f) => (
            <FeatureTreeNode
              key={f.uuid}
              feature={f}
              packageId={pkg.id}
              parentUuid={null}
              selectedUuid={selectedUuid}
              onSelect={onSelect}
              onActivate={onActivate}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function FeatureTreeNode({
  feature,
  packageId,
  parentUuid,
  selectedUuid,
  onSelect,
  onActivate,
}: {
  feature: Feature;
  packageId: string;
  parentUuid: string | null;
  selectedUuid: string | null;
  onSelect: (n: SelectedNode) => void;
  onActivate: (n: SelectedNode) => void;
}) {
  const isSelected = selectedUuid === feature.uuid;
  const node: SelectedNode = { feature, packageId, parentUuid };
  return (
    <li>
      <button
        type="button"
        className={`feature-tree__row ${isSelected ? 'is-selected' : ''}`}
        onClick={() => onSelect(node)}
        onDoubleClick={() => onActivate(node)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onActivate(node);
        }}
        style={{
          background: 'none',
          border: 'none',
          width: '100%',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <span className="feature-tree__caret">{feature.subFeatures.length ? '▾' : '·'}</span>
        <span className="feature-tree__name">{feature.featureName}</span>
        <code className="feature-tree__badge">{feature.featureId}</code>
        {feature.optional && <span className="tag">optional</span>}
        {feature.isPermission && <span className="tag">permission</span>}
      </button>
      {feature.subFeatures.length > 0 && (
        <ul>
          {feature.subFeatures.map((c) => (
            <FeatureTreeNode
              key={c.uuid}
              feature={c}
              packageId={packageId}
              parentUuid={feature.uuid}
              selectedUuid={selectedUuid}
              onSelect={onSelect}
              onActivate={onActivate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

interface FeatureFormState {
  uuid: string;
  featureId: string;
  featureName: string;
  description: string;
  optional: boolean;
  isPermission: boolean;
  dependencies: string;
  packageId: string;
  parentUuid: string | null;
}

function FeatureEditor({
  packages,
  state,
  onClose,
  onSaved,
  onDeleted,
  onAddSub,
}: {
  packages: FeaturePackage[];
  state:
    | { mode: 'create'; packageId: string; parentUuid: string | null }
    | { mode: 'edit'; node: SelectedNode };
  onClose: () => void;
  onSaved: (n: SelectedNode) => void;
  onDeleted?: () => void;
  onAddSub?: (parentUuid: string) => void;
}) {
  const { hasPermission } = useSession();

  const initial: FeatureFormState = useMemo(() => {
    if (state.mode === 'edit') {
      const f = state.node.feature;
      return {
        uuid: f.uuid,
        featureId: f.featureId,
        featureName: f.featureName,
        description: f.description ?? '',
        optional: f.optional,
        isPermission: f.isPermission,
        dependencies: f.dependencies.join(', '),
        packageId: state.node.packageId,
        parentUuid: state.node.parentUuid,
      };
    }
    return {
      uuid: '',
      featureId: '',
      featureName: 'New feature',
      description: '',
      optional: false,
      isPermission: false,
      dependencies: '',
      packageId: state.packageId,
      parentUuid: state.parentUuid,
    };
  }, [state]);

  const [form, setForm] = useState<FeatureFormState>(initial);
  const [validation, setValidation] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [addFeature, addState] = useMutation<{ featureAdd: Feature }>(FEATURE_ADD, {
    refetchQueries: [{ query: PACKAGES_LIST }],
    awaitRefetchQueries: true,
  });
  const [updateFeature, updateState] = useMutation<{ featureUpdate: Feature }>(FEATURE_UPDATE, {
    refetchQueries: [{ query: PACKAGES_LIST }],
    awaitRefetchQueries: true,
  });
  const [removeFeature, removeState] = useMutation(FEATURE_REMOVE, {
    refetchQueries: [{ query: PACKAGES_LIST }],
    awaitRefetchQueries: true,
  });

  const submitting = addState.loading || updateState.loading;
  const isCreate = state.mode === 'create';
  const canEdit = isCreate || hasPermission('EditFeature') || hasPermission('ChangeFeature');
  const canDelete = !isCreate && hasPermission('RemoveFeature');

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.featureId.trim()) errors.featureId = 'Feature id is required';
    if (!form.featureName.trim()) errors.featureName = 'Name is required';
    if (!form.packageId) errors.packageId = 'Package is required';
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  async function onSubmit(e: import('react').FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    const input = {
      uuid: form.uuid || undefined,
      featureId: form.featureId.trim(),
      featureName: form.featureName.trim(),
      description: form.description.trim(),
      optional: form.optional,
      isPermission: form.isPermission,
      dependencies: form.dependencies
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean),
      packageId: form.packageId,
      parentFeatureUuid: form.parentUuid,
    };
    try {
      if (isCreate) {
        const res = await addFeature({ variables: { input } });
        const f = res.data?.featureAdd;
        if (f) onSaved({ feature: f, packageId: form.packageId, parentUuid: form.parentUuid });
      } else {
        const res = await updateFeature({ variables: { input } });
        const f = res.data?.featureUpdate;
        if (f) onSaved({ feature: f, packageId: form.packageId, parentUuid: form.parentUuid });
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} aria-busy={submitting}>
      <div className="panel__header">
        <div>
          <h2 className="panel__title">{isCreate ? 'New feature' : form.featureName || 'Edit feature'}</h2>
          {!isCreate && (
            <div className="panel__subtitle">
              <code>{form.featureId}</code> · package <code>{form.packageId}</code>
            </div>
          )}
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose} disabled={submitting}>
            Close
          </button>
          {!isCreate && onAddSub && (
            <button
              type="button"
              className="btn"
              disabled={!hasPermission('AddFeature')}
              onClick={() => onAddSub(form.uuid)}
            >
              + Sub-feature
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              className="btn btn--danger"
              disabled={removeState.loading}
              onClick={() => setConfirmDelete(true)}
            >
              Remove
            </button>
          )}
          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting || !canEdit}
          >
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {serverError && <div className="error-banner">{serverError}</div>}

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="ft-id">Feature id</label>
          <input
            id="ft-id"
            value={form.featureId}
            onChange={(e) => setForm({ ...form, featureId: e.target.value })}
            disabled={!canEdit}
          />
          {validation.featureId && <span className="error-text">{validation.featureId}</span>}
        </div>
        <div className="form-field" style={{ flex: 2 }}>
          <label htmlFor="ft-name">Feature name</label>
          <input
            id="ft-name"
            value={form.featureName}
            onChange={(e) => setForm({ ...form, featureName: e.target.value })}
            disabled={!canEdit}
          />
          {validation.featureName && (
            <span className="error-text">{validation.featureName}</span>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="ft-pkg">Package</label>
          <select
            id="ft-pkg"
            value={form.packageId}
            onChange={(e) => setForm({ ...form, packageId: e.target.value })}
            disabled={!isCreate}
          >
            {packages.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="ft-desc">Description</label>
        <textarea
          id="ft-desc"
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          disabled={!canEdit}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>
            <input
              type="checkbox"
              checked={form.optional}
              disabled={!canEdit}
              onChange={(e) => setForm({ ...form, optional: e.target.checked })}
            />{' '}
            Optional
          </label>
        </div>
        <div className="form-field">
          <label>
            <input
              type="checkbox"
              checked={form.isPermission}
              disabled={!canEdit}
              onChange={(e) => setForm({ ...form, isPermission: e.target.checked })}
            />{' '}
            Is a permission
          </label>
        </div>
        <div className="form-field" style={{ flex: 2 }}>
          <label htmlFor="ft-deps">Dependencies (comma- or semicolon-separated)</label>
          <input
            id="ft-deps"
            value={form.dependencies}
            onChange={(e) => setForm({ ...form, dependencies: e.target.value })}
            placeholder="EditFeature, ChangeFeature"
            disabled={!canEdit}
          />
        </div>
      </div>

      {!isCreate && state.mode === 'edit' && (
        <ConfirmDialog
          open={confirmDelete}
          title="Remove feature"
          message={`Remove the feature "${state.node.feature.featureName}" and all its sub-features?`}
          confirmLabel="Remove"
          destructive
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            setConfirmDelete(false);
            await removeFeature({ variables: { uuid: state.node.feature.uuid } });
            onDeleted?.();
          }}
        />
      )}
    </form>
  );
}
