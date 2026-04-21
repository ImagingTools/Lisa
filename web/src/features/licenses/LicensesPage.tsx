/**
 * Licenses feature module.
 *
 * QML correspondence:
 *   - `ImtCore/Qml/imtlicgui/LicenseCollectionView.qml`  → LicensesList
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

interface LicensesListData {
  licensesList: License[];
}
interface ProductsListData {
  productsList: Product[];
}
interface PackagesListData {
  packagesList: FeaturePackage[];
}

export function LicensesPage() {
  const { hasPermission } = useSession();
  const { data, loading, error, refetch } = useQuery<LicensesListData>(LICENSES_LIST);
  const { data: products } = useQuery<ProductsListData>(PRODUCTS_LIST);
  const { data: packages } = useQuery<PackagesListData>(PACKAGES_LIST);
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState<string>('');
  const [selected, setSelected] = useState<License | null>(null);
  const [creating, setCreating] = useState(false);

  const allFeatures = useMemo(
    () => flattenFeatures(packages?.packagesList ?? []),
    [packages?.packagesList],
  );

  const filtered = useMemo(() => {
    let list = data?.licensesList ?? [];
    if (productFilter) list = list.filter((l) => l.productId === productFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [data?.licensesList, productFilter, search]);

  if (loading && !data) return <CenteredSpinner label="Loading licenses…" />;

  return (
    <>
      <div className="page-header">
        <h1>Licenses</h1>
        <div className="page-toolbar">
          <select
            className="search"
            style={{ minWidth: 180 }}
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          >
            <option value="">All products</option>
            {products?.productsList.map((p) => (
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
            disabled={!hasPermission('AddLicense')}
            onClick={() => {
              setSelected(null);
              setCreating(true);
            }}
          >
            + New license
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          Failed to load licenses: {error.message}{' '}
          <button className="btn btn--small" onClick={() => refetch()}>Retry</button>
        </div>
      )}

      <div className="split">
        <div className="panel" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <EmptyState title="No licenses" message="Adjust your filter or create a new license." />
          ) : (
            <table className="table" aria-label="Licenses list">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>License id</th>
                  <th>Product</th>
                  <th>Features</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr
                    key={`${l.productId}::${l.id}`}
                    className={
                      selected?.id === l.id && selected?.productId === l.productId
                        ? 'is-selected'
                        : ''
                    }
                    onClick={() => {
                      setSelected(l);
                      setCreating(false);
                    }}
                  >
                    <td>{l.name}</td>
                    <td><code>{l.id}</code></td>
                    <td>{l.productId}</td>
                    <td>{l.features.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="panel">
          {creating ? (
            <LicenseEditor
              mode="create"
              products={products?.productsList ?? []}
              allFeatures={allFeatures}
              onClose={() => setCreating(false)}
              onSaved={(l) => {
                setCreating(false);
                setSelected(l);
              }}
            />
          ) : selected ? (
            <LicenseDetails
              license={selected}
              allFeatures={allFeatures}
              products={products?.productsList ?? []}
              onDeleted={() => setSelected(null)}
            />
          ) : (
            <EmptyState title="Select a license" message="Pick a license to view its details." />
          )}
        </div>
      </div>
    </>
  );
}

function LicenseDetails({
  license,
  allFeatures,
  products,
  onDeleted,
}: {
  license: License;
  allFeatures: Feature[];
  products: Product[];
  onDeleted: () => void;
}) {
  const { hasPermission } = useSession();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [removeLicense, removeState] = useMutation(LICENSE_REMOVE, {
    refetchQueries: [{ query: LICENSES_LIST }, { query: PRODUCTS_LIST }],
    awaitRefetchQueries: true,
  });

  if (editing) {
    return (
      <LicenseEditor
        mode="edit"
        license={license}
        products={products}
        allFeatures={allFeatures}
        onClose={() => setEditing(false)}
        onSaved={() => setEditing(false)}
      />
    );
  }

  const featuresOnLicense = allFeatures.filter((f) => license.features.includes(f.featureId));

  return (
    <>
      <div className="panel__header">
        <div>
          <h2 className="panel__title">{license.name}</h2>
          <div className="panel__subtitle">
            <code>{license.id}</code> · product <code>{license.productId}</code>
          </div>
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="btn"
            disabled={!hasPermission('ChangeLicense')}
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn--danger"
            disabled={!hasPermission('RemoveLicense') || removeState.loading}
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </button>
        </div>
      </div>
      <p>{license.description || <em>No description.</em>}</p>

      <h3>Granted features</h3>
      {featuresOnLicense.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>This license grants no features.</p>
      ) : (
        <div>
          {featuresOnLicense.map((f) => (
            <span key={f.uuid} className="tag tag--primary">{f.featureName}</span>
          ))}
        </div>
      )}

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
          await removeLicense({ variables: { id: license.id, productId: license.productId } });
          onDeleted();
        }}
      />
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
}: {
  mode: 'create' | 'edit';
  license?: License;
  products: Product[];
  allFeatures: Feature[];
  onClose: () => void;
  onSaved: (l: License) => void;
}) {
  const [form, setForm] = useState({
    id: license?.id ?? '',
    productId: license?.productId ?? products[0]?.id ?? '',
    name: license?.name ?? '',
    description: license?.description ?? '',
    features: new Set<string>(license?.features ?? []),
  });
  const [validation, setValidation] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [addLicense, addState] = useMutation<{ licenseAdd: License }>(LICENSE_ADD, {
    refetchQueries: [{ query: LICENSES_LIST }, { query: PRODUCTS_LIST }],
    awaitRefetchQueries: true,
  });
  const [updateLicense, updateState] = useMutation<{ licenseUpdate: License }>(LICENSE_UPDATE, {
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

  async function onSubmit(e: import("react").FormEvent) {
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
        <h2 className="panel__title">{mode === 'create' ? 'New license' : 'Edit license'}</h2>
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
            disabled={mode === 'edit'}
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
