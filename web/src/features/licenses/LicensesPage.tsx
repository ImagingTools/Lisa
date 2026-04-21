/**
 * Licenses feature module.
 *
 * QML correspondence:
 *   - `ImtCore/Qml/imtlicgui/LicenseCollectionView.qml`  → LicensesCollection
 *   - `ImtCore/Qml/imtlicgui/LicenseEditor.qml`           → LicenseEditor
 *
 * GraphQL ops: LicensesList / LicenseAdd / LicenseUpdate / LicenseRemove,
 *              ProductsList (for the parent-product picker).
 */
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  LICENSES_LIST,
  LICENSE_ADD,
  LICENSE_REMOVE,
  LICENSE_UPDATE,
  PACKAGES_LIST,
  PRODUCTS_LIST,
} from '@/api/graphql/operations';
import type { Feature, FeaturePackage, License, Product } from '@/types/domain';
import { useSession } from '@/auth/SessionContext';
import { CenteredSpinner } from '@/components/feedback/CenteredSpinner';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { MetaInfoPanel } from '@/components/MetaInfoPanel';
import { DataTable, type Column } from '@/components/DataTable';
import { COLLECTION_TAB_ID, PageTabs, usePageTabs } from '@/components/PageTabs';

interface LicensesListData {
  licensesList: License[];
}
interface ProductsListData {
  productsList: Product[];
}
interface PackagesListData {
  packagesList: FeaturePackage[];
}

const NEW_TAB_ID = 'new:license';
const editorTabId = (productId: string, id: string) => `editor:${productId}::${id}`;

export function LicensesPage() {
  const { hasPermission } = useSession();
  const { data, loading, error, refetch } = useQuery<LicensesListData>(LICENSES_LIST);
  const { data: products } = useQuery<ProductsListData>(PRODUCTS_LIST);
  const { data: packages } = useQuery<PackagesListData>(PACKAGES_LIST);
  const tabs = usePageTabs('licenses', 'Licenses');

  const allFeatures = useMemo(
    () => flattenFeatures(packages?.packagesList ?? []),
    [packages?.packagesList],
  );

  if (loading && !data) return <CenteredSpinner label="Loading licenses…" />;

  const list = data?.licensesList ?? [];
  const productsList = products?.productsList ?? [];

  const findLicense = (productId: string, id: string) =>
    list.find((l) => l.id === id && l.productId === productId) ?? null;

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
                  id: editorTabId(l.productId, l.id),
                  title: l.name,
                  subtitle: `${l.productId} · ${l.id}`,
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
                  id: editorTabId(saved.productId, saved.id),
                  title: saved.name,
                  subtitle: `${saved.productId} · ${saved.id}`,
                  closable: true,
                })
              }
            />
          );
        }
        if (!tabId.startsWith('editor:')) return null;
        const [productId, id] = tabId.slice('editor:'.length).split('::');
        const license = findLicense(productId, id);
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
                subtitle: `${saved.productId} · ${saved.id}`,
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
  licenses: License[];
  products: Product[];
  error?: string;
  onRetry: () => void;
  canCreate: boolean;
  onActivate: (l: License) => void;
  onCreate: () => void;
}) {
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState<string>('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let out = licenses;
    if (productFilter) out = out.filter((l) => l.productId === productFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      out = out.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q),
      );
    }
    return out;
  }, [licenses, productFilter, search]);

  const rowKey = (l: License) => `${l.productId}::${l.id}`;
  const selected =
    (selectedKey && licenses.find((l) => rowKey(l) === selectedKey)) || null;

  const columns: Column<License>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Name',
        cell: (l) => l.name,
        sortValue: (l) => l.name.toLowerCase(),
        width: 220,
      },
      {
        key: 'id',
        header: 'License id',
        cell: (l) => <code>{l.id}</code>,
        sortValue: (l) => l.id.toLowerCase(),
        width: 160,
      },
      {
        key: 'product',
        header: 'Product',
        cell: (l) => l.productId,
        sortValue: (l) => l.productId.toLowerCase(),
        width: 160,
      },
      {
        key: 'description',
        header: 'Description',
        cell: (l) => l.description,
        sortValue: (l) => l.description.toLowerCase(),
        width: 320,
      },
      {
        key: 'features',
        header: 'Features',
        cell: (l) => l.features.length,
        sortValue: (l) => l.features.length,
        width: 100,
      },
    ],
    [],
  );

  return (
    <>
      <div className="page-header">
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
      </div>

      {error && (
        <div className="error-banner" role="alert">
          Failed to load licenses: {error}{' '}
          <button className="btn btn--small" onClick={onRetry}>Retry</button>
        </div>
      )}

      <div className="collection-layout">
        <div className="panel" style={{ padding: 0 }}>
          <DataTable<License>
            tableId="licenses"
            ariaLabel="Licenses list"
            columns={columns}
            rows={filtered}
            rowKey={rowKey}
            selectedKey={selectedKey}
            onSelect={(l) => setSelectedKey(rowKey(l))}
            onActivate={onActivate}
            emptyMessage={
              search || productFilter
                ? 'No licenses match your filter.'
                : 'No licenses defined.'
            }
          />
          <div className="collection-layout__hint">
            Double-click a row (or press Enter) to open the editor in a new tab.
          </div>
        </div>
        <div className="panel">
          <h3 className="panel__title" style={{ marginBottom: 'var(--margin-m)' }}>
            Meta info
          </h3>
          {selected ? (
            <>
              <div className="panel__subtitle" style={{ marginBottom: 'var(--margin-m)' }}>
                <strong style={{ color: 'var(--color-text)' }}>{selected.name}</strong> ·{' '}
                <code>{selected.productId}</code> · <code>{selected.id}</code>
              </div>
              <MetaInfoPanel meta={selected.meta} />
            </>
          ) : (
            <p className="panel__subtitle">Select a row to see its metadata.</p>
          )}
        </div>
      </div>
    </>
  );
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
  license?: License;
  products: Product[];
  allFeatures: Feature[];
  onClose: () => void;
  onSaved: (l: License) => void;
  onDeleted?: () => void;
}) {
  const { hasPermission } = useSession();
  const [form, setForm] = useState({
    id: license?.id ?? '',
    productId: license?.productId ?? products[0]?.id ?? '',
    name: license?.name ?? '',
    description: license?.description ?? '',
    features: new Set<string>(license?.features ?? []),
  });
  const [validation, setValidation] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [addLicense, addState] = useMutation<{ licenseAdd: License }>(LICENSE_ADD, {
    refetchQueries: [{ query: LICENSES_LIST }, { query: PRODUCTS_LIST }],
    awaitRefetchQueries: true,
  });
  const [updateLicense, updateState] = useMutation<{ licenseUpdate: License }>(LICENSE_UPDATE, {
    refetchQueries: [{ query: LICENSES_LIST }, { query: PRODUCTS_LIST }],
    awaitRefetchQueries: true,
  });
  const [removeLicense, removeState] = useMutation(LICENSE_REMOVE, {
    refetchQueries: [{ query: LICENSES_LIST }, { query: PRODUCTS_LIST }],
    awaitRefetchQueries: true,
  });

  const submitting = addState.loading || updateState.loading;

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.productId) errors.productId = 'Product is required';
    if (mode === 'create' && !form.id.trim()) errors.id = 'License id is required';
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const canEdit = mode === 'create' || hasPermission('ChangeLicense');
  const canDelete = mode === 'edit' && hasPermission('RemoveLicense');

  async function onSubmit(e: import('react').FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    const input = {
      id: form.id.trim(),
      productId: form.productId,
      name: form.name.trim(),
      description: form.description.trim(),
      features: [...form.features],
    };
    try {
      if (mode === 'create') {
        const res = await addLicense({ variables: { input } });
        if (res.data?.licenseAdd) onSaved(res.data.licenseAdd);
      } else {
        const res = await updateLicense({ variables: { input } });
        if (res.data?.licenseUpdate) onSaved(res.data.licenseUpdate);
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
              <code>{form.id}</code> · product <code>{form.productId}</code>
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
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            readOnly={mode === 'edit'}
            placeholder="e.g. 12.10128"
          />
          {validation.id && <span className="error-text">{validation.id}</span>}
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
        {allFeatures.map((f) => {
          const checked = form.features.has(f.featureId);
          return (
            <li key={f.uuid}>
              <label className="feature-tree__row">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={!canEdit}
                  onChange={() => {
                    const next = new Set(form.features);
                    if (checked) next.delete(f.featureId);
                    else next.add(f.featureId);
                    setForm({ ...form, features: next });
                  }}
                />
                <span className="feature-tree__name">{f.featureName}</span>
                <code className="feature-tree__badge">{f.featureId}</code>
                <span className="tag">{f.packageId}</span>
              </label>
            </li>
          );
        })}
      </ul>

      {mode === 'edit' && license && (
        <>
          <h3>Metadata</h3>
          <MetaInfoPanel meta={license.meta} />
          <ConfirmDialog
            open={confirmDelete}
            title="Delete license"
            message={`Delete license "${license.name}" of product "${license.productId}"?`}
            confirmLabel="Delete"
            destructive
            onCancel={() => setConfirmDelete(false)}
            onConfirm={async () => {
              setConfirmDelete(false);
              await removeLicense({
                variables: { id: license.id, productId: license.productId },
              });
              onDeleted?.();
            }}
          />
        </>
      )}
    </form>
  );
}

function flattenFeatures(packages: FeaturePackage[]): Feature[] {
  const out: Feature[] = [];
  const walk = (f: Feature) => {
    out.push(f);
    f.subFeatures.forEach(walk);
  };
  packages.forEach((p) => p.features.forEach(walk));
  return out;
}
