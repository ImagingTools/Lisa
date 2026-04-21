/**
 * Features module.
 *
 * QML correspondence:
 *   - `ImtCore/Qml/imtlicgui/FeatureCollectionView.qml` → FeaturesCollection
 *   - `ImtCore/Qml/imtlicgui/FeatureEditor.qml`         → FeatureEditor
 *   - `ImtCore/Qml/imtlicgui/FeaturesDependenciesProvider.qml`
 *
 * Features form a tree (sub-features), so the collection tab uses a tree
 * widget rather than the flat `DataTable` used on the other pages. The
 * tab strip + per-row properties panel and "double-click opens editor in a
 * new tab" workflow mirror the other pages.
 *
 * GraphQL operations used:
 *   - FeaturesList / AddFeature / UpdateFeature
 *   - RemoveElements (generic collection removal, scoped to "features")
 */
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  FEATURES_LIST,
  FEATURE_ADD,
  FEATURE_UPDATE,
  REMOVE_ELEMENTS,
} from '@/api/graphql/operations';
import type { FeatureData, FeatureItem } from '@/types/domain';
import { useSession } from '@/auth/SessionContext';
import { CenteredSpinner } from '@/components/feedback/CenteredSpinner';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { COLLECTION_TAB_ID, PageTabs, usePageTabs } from '@/components/PageTabs';

interface FeaturesListData {
  FeaturesList: {
    items: FeatureItem[];
  };
}

/** A feature node located in the tree (keeps the parent id for context). */
interface SelectedNode {
  feature: FeatureItem | FeatureData;
  parentId: string | null;
}

const editorTabId = (id: string) => `editor:${id}`;
const NEW_TAB_PREFIX = 'new:';

interface NewState {
  parentId: string | null;
}

function nodeId(f: FeatureItem | FeatureData): string {
  return f.id ?? f.featureId ?? '';
}

function splitDeps(deps: string | undefined): string[] {
  return (deps ?? '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
}

function joinDeps(deps: string[]): string {
  return deps.map((s) => s.trim()).filter(Boolean).join(';');
}

export function FeaturesPage() {
  const { hasPermission } = useSession();
  const { data, loading, error, refetch } = useQuery<FeaturesListData>(FEATURES_LIST, {
    variables: { input: {} },
  });
  const tabs = usePageTabs('features', 'Features');
  // Pending "new feature" tabs are keyed by `new:<parentId|root>` and we keep
  // the create-context here so the editor knows where to insert.
  const [newStates, setNewStates] = useState<Record<string, NewState>>({});

  if (loading && !data) return <CenteredSpinner label="Loading features…" />;
  const features = data?.FeaturesList?.items ?? [];

  const findNode = (id: string): SelectedNode | null => {
    for (const f of features) {
      const found = walk(f, null, id);
      if (found) return found;
    }
    return null;
  };

  const openCreate = (parentId: string | null) => {
    const id = `${NEW_TAB_PREFIX}${parentId ?? 'root'}`;
    setNewStates((prev) => ({ ...prev, [id]: { parentId } }));
    tabs.openTab({
      id,
      title: parentId ? 'New sub-feature' : 'New feature',
      subtitle: parentId ?? undefined,
    });
  };

  return (
    <PageTabs
      api={tabs}
      renderTab={(tabId) => {
        if (tabId === COLLECTION_TAB_ID) {
          return (
            <FeaturesCollection
              features={features}
              error={error?.message}
              onRetry={() => refetch()}
              canAdd={hasPermission('AddFeature')}
              onActivate={(node) =>
                tabs.openTab({
                  id: editorTabId(nodeId(node.feature)),
                  title: node.feature.featureName ?? node.feature.name ?? nodeId(node.feature),
                  subtitle: node.feature.featureId,
                })
              }
              onAddRoot={() => openCreate(null)}
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
              state={{ mode: 'create', parentId: ns.parentId }}
              onClose={() => tabs.closeTab(tabId)}
              onSaved={(node) => {
                setNewStates((prev) => {
                  const next = { ...prev };
                  delete next[tabId];
                  return next;
                });
                tabs.replaceTab(tabId, {
                  id: editorTabId(nodeId(node.feature)),
                  title: node.feature.featureName ?? node.feature.name ?? nodeId(node.feature),
                  subtitle: node.feature.featureId,
                  closable: true,
                });
              }}
            />
          );
        }
        if (!tabId.startsWith('editor:')) return null;
        const id = tabId.slice('editor:'.length);
        const node = findNode(id);
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
            state={{ mode: 'edit', node }}
            onClose={() => tabs.closeTab(tabId)}
            onSaved={(saved) =>
              tabs.renameTab(tabId, {
                title: saved.feature.featureName ?? saved.feature.name ?? nodeId(saved.feature),
                subtitle: saved.feature.featureId,
              })
            }
            onDeleted={() => tabs.closeTab(tabId)}
            onAddSub={(parentId) => openCreate(parentId)}
          />
        );
      }}
    />
  );
}

function walk(
  feature: FeatureItem | FeatureData,
  parentId: string | null,
  id: string,
): SelectedNode | null {
  if (nodeId(feature) === id) return { feature, parentId };
  for (const c of feature.subFeatures ?? []) {
    const r = walk(c, nodeId(feature), id);
    if (r) return r;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Collection (tree view + selection properties panel)
// ---------------------------------------------------------------------------

function FeaturesCollection({
  features,
  error,
  onRetry,
  canAdd,
  onActivate,
  onAddRoot,
}: {
  features: FeatureItem[];
  error?: string;
  onRetry: () => void;
  canAdd: boolean;
  onActivate: (n: SelectedNode) => void;
  onAddRoot: () => void;
}) {
  const [selected, setSelected] = useState<SelectedNode | null>(null);

  return (
    <>
      <div className="page-header">
        <h1 style={{ margin: 0 }}>Features</h1>
        <div className="form-actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={onAddRoot}
            disabled={!canAdd}
            title={canAdd ? undefined : 'Requires AddFeature'}
          >
            + New feature
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          Failed to load features: {error}{' '}
          <button className="btn btn--small" onClick={onRetry}>Retry</button>
        </div>
      )}

      <div className="collection-layout">
        <div className="panel" style={{ padding: 'var(--margin-m)' }}>
          {features.length === 0 ? (
            <EmptyState title="No features" message="No features defined yet." />
          ) : (
            <ul className="feature-tree">
              {features.map((f) => (
                <FeatureTreeNode
                  key={nodeId(f)}
                  feature={f}
                  parentId={null}
                  selectedId={selected ? nodeId(selected.feature) : null}
                  onSelect={setSelected}
                  onActivate={onActivate}
                />
              ))}
            </ul>
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
  const { feature } = node;
  const deps = splitDeps(feature.dependencies);
  const subFeatures = feature.subFeatures ?? [];
  return (
    <>
      <div className="panel__subtitle" style={{ marginBottom: 'var(--margin-m)' }}>
        <strong style={{ color: 'var(--color-text)' }}>
          {feature.featureName ?? feature.name ?? nodeId(feature)}
        </strong>{' '}
        · <code>{feature.featureId}</code>
      </div>
      <dl className="meta-grid">
        <dt>Id</dt>
        <dd><code>{nodeId(feature)}</code></dd>
        <dt>Optional</dt>
        <dd>{feature.optional ? 'Yes' : 'No'}</dd>
        <dt>Permission</dt>
        <dd>{feature.isPermission ? 'Yes' : 'No'}</dd>
        <dt>Dependencies</dt>
        <dd>
          {deps.length === 0
            ? '—'
            : deps.map((d) => (
                <span key={d} className="tag">{d}</span>
              ))}
        </dd>
        <dt>Sub-features</dt>
        <dd>{subFeatures.length}</dd>
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

function FeatureTreeNode({
  feature,
  parentId,
  selectedId,
  onSelect,
  onActivate,
}: {
  feature: FeatureItem | FeatureData;
  parentId: string | null;
  selectedId: string | null;
  onSelect: (n: SelectedNode) => void;
  onActivate: (n: SelectedNode) => void;
}) {
  const id = nodeId(feature);
  const isSelected = selectedId === id;
  const node: SelectedNode = { feature, parentId };
  const subFeatures = feature.subFeatures ?? [];
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
        <span className="feature-tree__caret">{subFeatures.length ? '▾' : '·'}</span>
        <span className="feature-tree__name">
          {feature.featureName ?? feature.name ?? id}
        </span>
        <code className="feature-tree__badge">{feature.featureId}</code>
        {feature.optional && <span className="tag">optional</span>}
        {feature.isPermission && <span className="tag">permission</span>}
      </button>
      {subFeatures.length > 0 && (
        <ul>
          {subFeatures.map((c) => (
            <FeatureTreeNode
              key={nodeId(c)}
              feature={c}
              parentId={id}
              selectedId={selectedId}
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
  id: string;
  featureId: string;
  featureName: string;
  description: string;
  optional: boolean;
  isPermission: boolean;
  dependencies: string;
  parentId: string | null;
}

function FeatureEditor({
  state,
  onClose,
  onSaved,
  onDeleted,
  onAddSub,
}: {
  state:
    | { mode: 'create'; parentId: string | null }
    | { mode: 'edit'; node: SelectedNode };
  onClose: () => void;
  onSaved: (n: SelectedNode) => void;
  onDeleted?: () => void;
  onAddSub?: (parentId: string) => void;
}) {
  const { hasPermission } = useSession();

  const initial: FeatureFormState = useMemo(() => {
    if (state.mode === 'edit') {
      const f = state.node.feature;
      return {
        id: nodeId(f),
        featureId: f.featureId ?? '',
        featureName: f.featureName ?? f.name ?? '',
        description: f.description ?? '',
        optional: f.optional ?? false,
        isPermission: f.isPermission ?? false,
        dependencies: splitDeps(f.dependencies).join(', '),
        parentId: state.node.parentId,
      };
    }
    return {
      id: '',
      featureId: '',
      featureName: 'New feature',
      description: '',
      optional: false,
      isPermission: false,
      dependencies: '',
      parentId: state.parentId,
    };
  }, [state]);

  const [form, setForm] = useState<FeatureFormState>(initial);
  const [validation, setValidation] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [addFeature, addState] = useMutation<{ AddFeature: { id: string } }>(FEATURE_ADD, {
    refetchQueries: [{ query: FEATURES_LIST, variables: { input: {} } }],
    awaitRefetchQueries: true,
  });
  const [updateFeature, updateState] = useMutation<{ UpdateFeature: { id: string } }>(
    FEATURE_UPDATE,
    {
      refetchQueries: [{ query: FEATURES_LIST, variables: { input: {} } }],
      awaitRefetchQueries: true,
    },
  );
  const [removeFeature, removeState] = useMutation<{ RemoveElements: { success: boolean } }>(
    REMOVE_ELEMENTS,
    {
      refetchQueries: [{ query: FEATURES_LIST, variables: { input: {} } }],
      awaitRefetchQueries: true,
    },
  );

  const submitting = addState.loading || updateState.loading;
  const isCreate = state.mode === 'create';
  const canEdit = isCreate || hasPermission('EditFeature') || hasPermission('ChangeFeature');
  const canDelete = !isCreate && hasPermission('RemoveFeature');

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.featureId.trim()) errors.featureId = 'Feature id is required';
    if (!form.featureName.trim()) errors.featureName = 'Name is required';
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  async function onSubmit(e: import('react').FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    const featureId = form.featureId.trim();
    const id = isCreate ? featureId : form.id || featureId;
    const depsList = form.dependencies
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const item: FeatureData = {
      id,
      featureId,
      featureName: form.featureName.trim(),
      name: form.featureName.trim(),
      description: form.description.trim(),
      optional: form.optional,
      isPermission: form.isPermission,
      dependencies: joinDeps(depsList),
    };
    const input = { id, item };
    try {
      if (isCreate) {
        const res = await addFeature({ variables: { input } });
        const newId = res.data?.AddFeature?.id ?? id;
        onSaved({
          feature: { ...item, id: newId },
          parentId: form.parentId,
        });
      } else {
        const res = await updateFeature({ variables: { input } });
        const updatedId = res.data?.UpdateFeature?.id ?? id;
        onSaved({
          feature: { ...item, id: updatedId },
          parentId: form.parentId,
        });
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} aria-busy={submitting}>
      <div className="panel__header">
        <div>
          <h2 className="panel__title">
            {isCreate ? 'New feature' : form.featureName || 'Edit feature'}
          </h2>
          {!isCreate && (
            <div className="panel__subtitle">
              <code>{form.featureId}</code>
              {form.parentId && <> · parent <code>{form.parentId}</code></>}
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
              onClick={() => onAddSub(form.id)}
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
            disabled={!canEdit || !isCreate}
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
          message={`Remove the feature "${
            state.node.feature.featureName ?? state.node.feature.name ?? nodeId(state.node.feature)
          }" and all its sub-features?`}
          confirmLabel="Remove"
          destructive
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            setConfirmDelete(false);
            await removeFeature({
              variables: {
                input: {
                  collectionId: 'features',
                  elementIds: [nodeId(state.node.feature)],
                },
              },
            });
            onDeleted?.();
          }}
        />
      )}
    </form>
  );
}
