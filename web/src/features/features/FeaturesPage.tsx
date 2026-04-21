/**
 * Features / Packages module.
 *
 * QML correspondence:
 *   - `ImtCore/Qml/imtlicgui/FeatureCollectionView.qml` → list of features
 *   - `ImtCore/Qml/imtlicgui/FeatureEditor.qml`         → tree editor
 *   - `ImtCore/Qml/imtlicgui/FeaturesDependenciesProvider.qml`
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

interface PackagesListData {
  packagesList: FeaturePackage[];
}

interface SelectedNode {
  feature: Feature;
  packageId: string;
  parentUuid: string | null;
}

export function FeaturesPage() {
  const { hasPermission } = useSession();
  const { data, loading, error, refetch } =
    useQuery<PackagesListData>(PACKAGES_LIST);
  const [selected, setSelected] = useState<SelectedNode | null>(null);
  const [editing, setEditing] = useState<
    | { mode: 'create'; packageId: string; parentUuid: string | null }
    | { mode: 'edit'; node: SelectedNode }
    | null
  >(null);
  const [confirmDelete, setConfirmDelete] = useState<SelectedNode | null>(null);

  const [removeFeature, removeState] = useMutation(FEATURE_REMOVE, {
    refetchQueries: [{ query: PACKAGES_LIST }],
    awaitRefetchQueries: true,
  });

  if (loading && !data) return <CenteredSpinner label="Loading features…" />;

  return (
    <>
      <div className="page-header">
        <h1>Features &amp; packages</h1>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          Failed to load features: {error.message}{' '}
          <button className="btn btn--small" onClick={() => refetch()}>Retry</button>
        </div>
      )}

      <div className="split">
        <div className="panel" style={{ padding: 'var(--margin-m)' }}>
          {data?.packagesList?.length === 0 ? (
            <EmptyState title="No packages" message="No feature packages defined yet." />
          ) : (
            data?.packagesList.map((pkg) => (
              <PackageBlock
                key={pkg.id}
                pkg={pkg}
                selectedUuid={selected?.feature.uuid ?? null}
                onSelect={(node) => setSelected(node)}
                onAddRoot={() =>
                  setEditing({ mode: 'create', packageId: pkg.id, parentUuid: null })
                }
                canAdd={hasPermission('AddFeature')}
              />
            ))
          )}
        </div>

        <div className="panel">
          {editing ? (
            <FeatureEditor
              key={
                editing.mode === 'edit'
                  ? editing.node.feature.uuid
                  : `new-${editing.packageId}-${editing.parentUuid ?? 'root'}`
              }
              packages={data?.packagesList ?? []}
              state={editing}
              onClose={() => setEditing(null)}
              onSaved={(node) => {
                setSelected(node);
                setEditing(null);
              }}
            />
          ) : selected ? (
            <FeatureDetails
              node={selected}
              canEdit={hasPermission('EditFeature') || hasPermission('ChangeFeature')}
              canRemove={hasPermission('RemoveFeature')}
              canAddSub={hasPermission('AddFeature')}
              onEdit={() => setEditing({ mode: 'edit', node: selected })}
              onAddSub={() =>
                setEditing({
                  mode: 'create',
                  packageId: selected.packageId,
                  parentUuid: selected.feature.uuid,
                })
              }
              onRemove={() => setConfirmDelete(selected)}
              busy={removeState.loading}
            />
          ) : (
            <EmptyState
              title="Select a feature"
              message="Pick a feature from the tree, or add a new one."
            />
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Remove feature"
        message={
          confirmDelete
            ? `Remove the feature "${confirmDelete.feature.featureName}" and all its sub-features?`
            : ''
        }
        confirmLabel="Remove"
        destructive
        onCancel={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (!confirmDelete) return;
          await removeFeature({ variables: { uuid: confirmDelete.feature.uuid } });
          if (selected?.feature.uuid === confirmDelete.feature.uuid) setSelected(null);
          setConfirmDelete(null);
        }}
      />
    </>
  );
}

function PackageBlock({
  pkg,
  selectedUuid,
  onSelect,
  onAddRoot,
  canAdd,
}: {
  pkg: FeaturePackage;
  selectedUuid: string | null;
  onSelect: (n: SelectedNode) => void;
  onAddRoot: () => void;
  canAdd: boolean;
}) {
  return (
    <div style={{ marginBottom: 'var(--margin-l)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <strong>{pkg.name}</strong>{' '}
          <span className="panel__subtitle">
            <code>{pkg.id}</code>
          </span>
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
}: {
  feature: Feature;
  packageId: string;
  parentUuid: string | null;
  selectedUuid: string | null;
  onSelect: (n: SelectedNode) => void;
}) {
  const isSelected = selectedUuid === feature.uuid;
  return (
    <li>
      <button
        type="button"
        className={`feature-tree__row ${isSelected ? 'is-selected' : ''}`}
        onClick={() => onSelect({ feature, packageId, parentUuid })}
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
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function FeatureDetails({
  node,
  canEdit,
  canRemove,
  canAddSub,
  onEdit,
  onAddSub,
  onRemove,
  busy,
}: {
  node: SelectedNode;
  canEdit: boolean;
  canRemove: boolean;
  canAddSub: boolean;
  onEdit: () => void;
  onAddSub: () => void;
  onRemove: () => void;
  busy: boolean;
}) {
  const { feature, packageId } = node;
  return (
    <>
      <div className="panel__header">
        <div>
          <h2 className="panel__title">{feature.featureName}</h2>
          <div className="panel__subtitle">
            <code>{feature.featureId}</code> · package <code>{packageId}</code>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn" disabled={!canAddSub} onClick={onAddSub}>
            + Sub-feature
          </button>
          <button type="button" className="btn" disabled={!canEdit} onClick={onEdit}>
            Edit
          </button>
          <button
            type="button"
            className="btn btn--danger"
            disabled={!canRemove || busy}
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </div>

      <div>{feature.description || <em>No description.</em>}</div>

      <h3>Properties</h3>
      <dl className="meta-grid">
        <dt>UUID</dt>
        <dd>
          <code>{feature.uuid}</code>
        </dd>
        <dt>Optional</dt>
        <dd>{feature.optional ? 'Yes' : 'No'}</dd>
        <dt>Permission</dt>
        <dd>{feature.isPermission ? 'Yes' : 'No'}</dd>
        <dt>Dependencies</dt>
        <dd>
          {feature.dependencies.length === 0
            ? '—'
            : feature.dependencies.map((d) => (
                <span key={d} className="tag">
                  {d}
                </span>
              ))}
        </dd>
      </dl>
    </>
  );
}

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
}: {
  packages: FeaturePackage[];
  state:
    | { mode: 'create'; packageId: string; parentUuid: string | null }
    | { mode: 'edit'; node: SelectedNode };
  onClose: () => void;
  onSaved: (n: SelectedNode) => void;
}) {
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

  const [addFeature, addState] = useMutation<{ featureAdd: Feature }>(FEATURE_ADD, {
    refetchQueries: [{ query: PACKAGES_LIST }],
    awaitRefetchQueries: true,
  });
  const [updateFeature, updateState] = useMutation<{ featureUpdate: Feature }>(FEATURE_UPDATE, {
    refetchQueries: [{ query: PACKAGES_LIST }],
    awaitRefetchQueries: true,
  });

  const submitting = addState.loading || updateState.loading;
  const isCreate = state.mode === 'create';

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.featureId.trim()) errors.featureId = 'Feature id is required';
    if (!form.featureName.trim()) errors.featureName = 'Name is required';
    if (!form.packageId) errors.packageId = 'Package is required';
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  async function onSubmit(e: import("react").FormEvent) {
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
        <h2 className="panel__title">{isCreate ? 'New feature' : 'Edit feature'}</h2>
        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
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
          />
          {validation.featureId && <span className="error-text">{validation.featureId}</span>}
        </div>
        <div className="form-field" style={{ flex: 2 }}>
          <label htmlFor="ft-name">Feature name</label>
          <input
            id="ft-name"
            value={form.featureName}
            onChange={(e) => setForm({ ...form, featureName: e.target.value })}
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
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>
            <input
              type="checkbox"
              checked={form.optional}
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
          />
        </div>
      </div>
    </form>
  );
}
