/**
 * Licenses feature module.
 *
 * QML correspondence:
 *   - `ImtCore/Qml/imtlicgui/LicenseCollectionView.qml`  → LicensesCollection
 *   - `ImtCore/Qml/imtlicgui/LicenseEditor.qml`           → LicenseEditor
 *
 * GraphQL ops: LicensesList / LicenseAdd / LicenseUpdate / RemoveElements,
 *              ProductsList (for the parent-product picker),
 *              FeaturesList (for the feature picker).
 */
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  FEATURES_LIST,
  LICENSES_LIST,
  LICENSE_ADD,
  LICENSE_UPDATE,
  PRODUCTS_LIST,
  REMOVE_ELEMENTS,
} from '@/api/graphql/operations';
import type {
  FeatureData,
  FeatureItem,
  LicenseDefinitionData,
  LicenseItem,
  ProductItem,
} from '@/types/domain';
import { useSession } from '@/auth/SessionContext';
import { CenteredSpinner } from '@/components/feedback/CenteredSpinner';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { MetaInfoPanel } from '@/components/MetaInfoPanel';
import { type Column } from '@/components/DataTable';
import { CollectionLayout } from '@/components/CollectionLayout';
import { COLLECTION_TAB_ID, PageTabs, usePageTabs } from '@/components/PageTabs';

interface LicensesListData {
  LicensesList: {
    items: LicenseItem[];
  };
}
interface ProductsListData {
  ProductsList: {
    items: ProductItem[];
  };
}
interface FeaturesListData {
  FeaturesList: {
    items: FeatureItem[];
  };
}

const NEW_TAB_ID = 'new:license';
const editorTabId = (id: string) => `editor:${id}`;

/** Split a `;`-delimited feature id list into a clean array. */
function splitFeatures(s: string | undefined | null): string[] {
  if (!s) return [];
  return s.split(';').map((x) => x.trim()).filter((x) => x.length > 0);
}

/** Join feature ids back into a `;`-delimited string. */
function joinFeatures(ids: Iterable<string>): string {
  return [...ids].join(';');
}

export function LicensesPage() {
  const { hasPermission } = useSession();
  const { data, loading, error, refetch } = useQuery<LicensesListData>(LICENSES_LIST, {
    variables: { input: {} },
  });
  const { data: products } = useQuery<ProductsListData>(PRODUCTS_LIST, {
    variables: { input: {} },
  });
  const { data: featData } = useQuery<FeaturesListData>(FEATURES_LIST, {
    variables: { input: {} },
  });
  const tabs = usePageTabs('licenses', 'Licenses');

  const allFeatures = useMemo(
    () => flattenFeatures(featData?.FeaturesList?.items ?? []),
    [featData?.FeaturesList?.items],
  );

  if (loading && !data) return <CenteredSpinner label="Loading licenses…" />;

  const list = data?.LicensesList?.items ?? [];
  const productsList = products?.ProductsList?.items ?? [];

  const findLicense = (id: string) => list.find((l) => l.id === id) ?? null;

  return (
    <PageTabs
      api={tabs}
      renderTab={(tabId) => {
        if (tabId === COLLECTION_TAB_ID) {
          return (
            <LicensesCollection
              licenses={list}
              products={productsList}
              error={error?.message}
              onRetry={() => refetch()}
              canCreate={hasPermission('AddLicense')}
              onActivate={(l) =>
                tabs.openTab({
                  id: editorTabId(l.id),
                  title: l.licenseName,
                  subtitle: `${l.productId ?? '—'} · ${l.licenseId}`,
                })
              }
              onCreate={() =>
                tabs.openTab({ id: NEW_TAB_ID, title: 'New license' })
              }
            />
          );
        }
        if (tabId === NEW_TAB_ID) {
          return (
            <LicenseEditor
              mode="create"
              products={productsList}
              allFeatures={allFeatures}
              onClose={() => tabs.closeTab(NEW_TAB_ID)}
              onSaved={(saved) =>
                tabs.replaceTab(NEW_TAB_ID, {
                  id: editorTabId(saved.id),
                  title: saved.name,
                  subtitle: `${saved.productId ?? '—'} · ${saved.licenseId}`,
                  closable: true,
                })
              }
            />
          );
        }
        if (!tabId.startsWith('editor:')) return null;
        const id = tabId.slice('editor:'.length);
        const license = findLicense(id);
        if (!license) {
          return (
            <EmptyState
              title="License not found"
              message="This license no longer exists. Close this tab to dismiss it."
            />
          );
        }
        return (
          <LicenseEditor
            mode="edit"
            license={license}
            products={productsList}
            allFeatures={allFeatures}
            onClose={() => tabs.closeTab(tabId)}
            onSaved={(saved) =>
              tabs.renameTab(tabId, {
                title: saved.name,
                subtitle: `${saved.productId ?? '—'} · ${saved.licenseId}`,
              })
            }
            onDeleted={() => tabs.closeTab(tabId)}
          />
        );
      }}
    />
  );
}

function LicensesCollection({
  licenses,
  products,
  error,
  onRetry,
  canCreate,
  onActivate,
  onCreate,
}: {
  licenses: LicenseItem[];
  products: ProductItem[];
  error?: string;
  onRetry: () => void;
  canCreate: boolean;
  onActivate: (l: LicenseItem) => void;
  onCreate: () => void;
}) {
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let out = licenses;
    if (productFilter) out = out.filter((l) => l.productId === productFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      out = out.filter(
        (l) =>
          l.licenseName.toLowerCase().includes(q) ||
          l.licenseId.toLowerCase().includes(q) ||
          (l.description ?? '').toLowerCase().includes(q),
      );
    }
    return out;
  }, [licenses, productFilter, search]);

  const columns: Column<LicenseItem>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Name',
        cell: (l) => l.licenseName,
        sortValue: (l) => l.licenseName.toLowerCase(),
        width: 220,
      },
      {
        key: 'licenseId',
        header: 'License id',
        cell: (l) => <code>{l.licenseId}</code>,
        sortValue: (l) => l.licenseId.toLowerCase(),
        width: 160,
      },
      {
        key: 'product',
        header: 'Product',
        cell: (l) => l.productId ?? '',
        sortValue: (l) => (l.productId ?? '').toLowerCase(),
        width: 160,
      },
      {
        key: 'description',
        header: 'Description',
        cell: (l) => l.description ?? '',
        sortValue: (l) => (l.description ?? '').toLowerCase(),
        width: 320,
      },
      {
        key: 'features',
        header: 'Features',
        cell: (l) => splitFeatures(l.features).length,
        sortValue: (l) => splitFeatures(l.features).length,
        width: 100,
      },
    ],
    [],
  );

  return (
    <CollectionLayout<LicenseItem>
      tableId="licenses"
      ariaLabel="Licenses list"
      columns={columns}
      rows={filtered}
      rowKey={(l) => l.id}
      selectedKey={selectedId}
      onSelect={(l) => setSelectedId(l.id)}
      onActivate={onActivate}
      emptyMessage={
        search || productFilter
          ? 'No licenses match your filter.'
          : 'No licenses defined.'
      }
      error={error ? `Failed to load licenses: ${error}` : undefined}
      onRetry={onRetry}
      toolbar={
        <div className="page-toolbar" style={{ flex: 1 }}>
          <select
            className="search"
            style={{ minWidth: 180 }}
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          >
            <option value="">All products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="search"
            className="search"
            placeholder="Search licenses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            className="btn btn--primary"
            disabled={!canCreate}
            onClick={onCreate}
            title={canCreate ? undefined : 'Requires AddLicense'}
          >
            + New license
          </button>
        </div>
      }
      renderDetails={(selected) =>
        selected ? (
          <>
            <div className="panel__subtitle" style={{ marginBottom: 'var(--margin-m)' }}>
              <strong style={{ color: 'var(--color-text)' }}>{selected.licenseName}</strong> ·{' '}
              <code>{selected.productId ?? '—'}</code> · <code>{selected.licenseId}</code>
            </div>
            <MetaInfoPanel item={selected} />
          </>
        ) : (
          <p className="panel__subtitle">Select a row to see its metadata.</p>
        )
      }
    />
  );
}

interface SavedLicense {
  id: string;
  name: string;
  licenseId: string;
  productId?: string;
}

function LicenseEditor({
  mode,
  license,
  products,
  allFeatures,
  onClose,
  onSaved,
  onDeleted,
}: {
  mode: 'create' | 'edit';
  license?: LicenseItem;
  products: ProductItem[];
  allFeatures: FeatureData[];
  onClose: () => void;
  onSaved: (l: SavedLicense) => void;
  onDeleted?: () => void;
}) {
  const { hasPermission } = useSession();
  const [form, setForm] = useState({
    licenseId: license?.licenseId ?? '',
    productId: license?.productId ?? products[0]?.id ?? '',
    name: license?.licenseName ?? '',
    description: license?.description ?? '',
    features: new Set<string>(splitFeatures(license?.features)),
  });
  const [validation, setValidation] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [addLicense, addState] = useMutation<{ LicenseAdd: { id: string } }>(LICENSE_ADD, {
    refetchQueries: [{ query: LICENSES_LIST }, { query: PRODUCTS_LIST }],
    awaitRefetchQueries: true,
  });
  const [updateLicense, updateState] = useMutation<{ LicenseUpdate: { id: string } }>(
    LICENSE_UPDATE,
    {
      refetchQueries: [{ query: LICENSES_LIST }, { query: PRODUCTS_LIST }],
      awaitRefetchQueries: true,
    },
  );
  const [removeLicense, removeState] = useMutation<{ RemoveElements: { success: boolean } }>(
    REMOVE_ELEMENTS,
    {
      refetchQueries: [{ query: LICENSES_LIST }, { query: PRODUCTS_LIST }],
      awaitRefetchQueries: true,
    },
  );

  const submitting = addState.loading || updateState.loading;

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.productId) errors.productId = 'Product is required';
    if (mode === 'create' && !form.licenseId.trim()) errors.licenseId = 'License id is required';
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const canEdit = mode === 'create' || hasPermission('ChangeLicense');
  const canDelete = mode === 'edit' && hasPermission('RemoveLicense');

  async function onSubmit(e: import('react').FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    const licenseId = form.licenseId.trim();
    const id = mode === 'edit' ? (license?.id ?? licenseId) : licenseId;
    const item: LicenseDefinitionData = {
      id,
      licenseId,
      licenseName: form.name.trim(),
      description: form.description.trim(),
      productId: form.productId,
      features: joinFeatures(form.features),
    };
    const input = { id, item };
    try {
      if (mode === 'create') {
        const res = await addLicense({ variables: { input } });
        const newId = res.data?.LicenseAdd?.id ?? id;
        onSaved({
          id: newId,
          name: item.licenseName!,
          licenseId,
          productId: item.productId,
        });
      } else {
        const res = await updateLicense({ variables: { input } });
        const updatedId = res.data?.LicenseUpdate?.id ?? id;
        onSaved({
          id: updatedId,
          name: item.licenseName!,
          licenseId,
          productId: item.productId,
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
            {mode === 'create' ? 'New license' : form.name || 'Edit license'}
          </h2>
          {mode === 'edit' && (
            <div className="panel__subtitle">
              <code>{form.licenseId}</code> · product <code>{form.productId}</code>
            </div>
          )}
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose} disabled={submitting}>
            Close
          </button>
          {canDelete && (
            <button
              type="button"
              className="btn btn--danger"
              disabled={removeState.loading}
              onClick={() => setConfirmDelete(true)}
            >
              Delete
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
          <label htmlFor="lic-id">License id</label>
          <input
            id="lic-id"
            value={form.licenseId}
            onChange={(e) => setForm({ ...form, licenseId: e.target.value })}
            readOnly={mode === 'edit'}
            placeholder="e.g. 12.10128"
          />
          {validation.licenseId && <span className="error-text">{validation.licenseId}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="lic-product">Product</label>
          <select
            id="lic-product"
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            disabled={mode === 'edit' || !canEdit}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {validation.productId && <span className="error-text">{validation.productId}</span>}
        </div>
        <div className="form-field" style={{ flex: 2 }}>
          <label htmlFor="lic-name">Name</label>
          <input
            id="lic-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={!canEdit}
          />
          {validation.name && <span className="error-text">{validation.name}</span>}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="lic-desc">Description</label>
        <textarea
          id="lic-desc"
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          disabled={!canEdit}
        />
      </div>

      <h3 style={{ marginBottom: 0 }}>Features granted by this license</h3>
      <ul className="feature-tree" style={{ maxHeight: 320, overflow: 'auto' }}>
        {allFeatures.map((f, i) => {
          const featureId = f.featureId ?? '';
          const featureName = f.featureName ?? f.name ?? featureId;
          const checked = form.features.has(featureId);
          return (
            <li key={f.id ?? featureId ?? i}>
              <label className="feature-tree__row">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={!canEdit}
                  onChange={() => {
                    const next = new Set(form.features);
                    if (checked) next.delete(featureId);
                    else next.add(featureId);
                    setForm({ ...form, features: next });
                  }}
                />
                <span className="feature-tree__name">{featureName}</span>
                <code className="feature-tree__badge">{featureId}</code>
                {f.optional && <span className="tag">optional</span>}
                {f.isPermission && <span className="tag">permission</span>}
              </label>
            </li>
          );
        })}
      </ul>

      {mode === 'edit' && license && (
        <>
          <h3>Metadata</h3>
          <MetaInfoPanel item={license} />
          <ConfirmDialog
            open={confirmDelete}
            title="Delete license"
            message={`Delete license "${license.licenseName}" of product "${license.productId ?? '—'}"?`}
            confirmLabel="Delete"
            destructive
            onCancel={() => setConfirmDelete(false)}
            onConfirm={async () => {
              setConfirmDelete(false);
              await removeLicense({
                variables: {
                  input: { collectionId: 'licenses', elementIds: [license.id] },
                },
              });
              onDeleted?.();
            }}
          />
        </>
      )}
    </form>
  );
}

/** Recursively flatten FeatureItem trees into a flat list of FeatureData. */
function flattenFeatures(features: FeatureItem[]): FeatureData[] {
  const out: FeatureData[] = [];
  const walk = (f: FeatureData) => {
    out.push(f);
    (f.subFeatures ?? []).forEach(walk);
  };
  features.forEach(walk);
  return out;
}
