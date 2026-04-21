/**
 * Products feature module.
 *
 * QML correspondence:
 *   - `ImtCore/Qml/imtlicgui/ProductCollectionView.qml`            → ProductsList
 *   - `ImtCore/Qml/imtlicgui/ProductView.qml`                      → ProductEditor
 *   - `ImtCore/Qml/imtlicgui/ProductCollectionViewCommandsDelegate` → toolbar
 *
 * GraphQL operations used:
 *   - ProductsList / ProductItem / ProductAdd / ProductUpdate / ProductRemove
 *   - PackagesList (for the feature picker)
 */
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  PACKAGES_LIST,
  PRODUCTS_LIST,
  PRODUCT_ADD,
  PRODUCT_REMOVE,
  PRODUCT_UPDATE,
} from '@/api/graphql/operations';
import type { Feature, FeaturePackage, Product, ProductCategory } from '@/types/domain';
import { useSession } from '@/auth/SessionContext';
import { CenteredSpinner } from '@/components/feedback/CenteredSpinner';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { MetaInfoPanel } from '@/components/MetaInfoPanel';
import {
  parseFeatureSelection,
  serializeFeatureSelection,
  toggleFeatureId,
  type FeatureSelection,
} from './featureSelection';

interface ProductsListData {
  productsList: Product[];
}

interface PackagesListData {
  packagesList: FeaturePackage[];
}

export function ProductsPage() {
  const { hasPermission } = useSession();
  const { data, loading, error, refetch } = useQuery<ProductsListData>(PRODUCTS_LIST);
  const { data: pkgData } = useQuery<PackagesListData>(PACKAGES_LIST);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editorState, setEditorState] = useState<EditorState>({ mode: 'idle' });

  const filteredProducts = useMemo(() => {
    const list = data?.productsList ?? [];
    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [data?.productsList, search]);

  const selected =
    (selectedId && data?.productsList.find((p) => p.id === selectedId)) || null;

  if (loading && !data) return <CenteredSpinner label="Loading products…" />;

  return (
    <>
      <div className="page-header">
        <h1>Products</h1>
        <div className="page-toolbar">
          <input
            type="search"
            className="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            className="btn btn--primary"
            disabled={!hasPermission('AddProduct')}
            onClick={() => setEditorState({ mode: 'create' })}
            title={hasPermission('AddProduct') ? undefined : 'Requires AddProduct'}
          >
            + New product
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          Failed to load products: {error.message}{' '}
          <button className="btn btn--small" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      <div className="split">
        <div className="panel" style={{ padding: 0 }}>
          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No products"
              message={search ? 'No products match your filter.' : 'Create your first product to get started.'}
            />
          ) : (
            <table className="table" aria-label="Products list">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Id</th>
                  <th>Category</th>
                  <th>Licenses</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className={selectedId === p.id ? 'is-selected' : ''}
                    onClick={() => {
                      setSelectedId(p.id);
                      setEditorState({ mode: 'view' });
                    }}
                  >
                    <td>{p.name}</td>
                    <td><code>{p.id}</code></td>
                    <td>
                      <span className="tag">{p.categoryId}</span>
                    </td>
                    <td>{p.licenses.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="panel">
          {editorState.mode === 'create' ? (
            <ProductEditor
              packages={pkgData?.packagesList ?? []}
              mode="create"
              onClose={() => setEditorState({ mode: 'idle' })}
              onSaved={(newProduct) => {
                setSelectedId(newProduct.id);
                setEditorState({ mode: 'view' });
              }}
            />
          ) : selected ? (
            <ProductDetails
              product={selected}
              packages={pkgData?.packagesList ?? []}
              onDeleted={() => setSelectedId(null)}
            />
          ) : (
            <EmptyState
              title="Select a product"
              message="Pick a product from the list, or create a new one to view its details."
            />
          )}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Product details / editor
// ---------------------------------------------------------------------------

type EditorState =
  | { mode: 'idle' }
  | { mode: 'view' }
  | { mode: 'create' };

function ProductDetails({
  product,
  packages,
  onDeleted,
}: {
  product: Product;
  packages: FeaturePackage[];
  onDeleted: () => void;
}) {
  const { hasPermission } = useSession();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [removeProduct, removeState] = useMutation(PRODUCT_REMOVE, {
    refetchQueries: [{ query: PRODUCTS_LIST }],
    awaitRefetchQueries: true,
  });

  if (editing) {
    return (
      <ProductEditor
        product={product}
        packages={packages}
        mode="edit"
        onClose={() => setEditing(false)}
        onSaved={() => setEditing(false)}
      />
    );
  }

  const selection = parseFeatureSelection(product.features);

  return (
    <>
      <div className="panel__header">
        <div>
          <h2 className="panel__title">{product.name}</h2>
          <div className="panel__subtitle">
            <code>{product.id}</code> · {product.categoryId}
          </div>
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="btn"
            disabled={!hasPermission('ChangeProduct')}
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn--danger"
            disabled={!hasPermission('RemoveProduct') || removeState.loading}
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </button>
        </div>
      </div>

      {product.description && <p>{product.description}</p>}

      <h3>Licenses</h3>
      {product.licenses.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>No licenses defined.</p>
      ) : (
        <ul>
          {product.licenses.map((l) => (
            <li key={l.id}>
              <strong>{l.name}</strong> · <code>{l.id}</code>
            </li>
          ))}
        </ul>
      )}

      <h3>Selected features</h3>
      <SelectedFeaturesSummary selection={selection} packages={packages} />

      <h3>Metadata</h3>
      <MetaInfoPanel meta={product.meta} />

      <ConfirmDialog
        open={confirmDelete}
        title="Delete product"
        message={`Delete the product "${product.name}"? This will also remove its licenses.`}
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          setConfirmDelete(false);
          await removeProduct({ variables: { id: product.id } });
          onDeleted();
        }}
      />
    </>
  );
}

function SelectedFeaturesSummary({
  selection,
  packages,
}: {
  selection: FeatureSelection;
  packages: FeaturePackage[];
}) {
  const allFeatures = useMemo(() => flattenFeatures(packages), [packages]);
  const selectedById = allFeatures.filter((f) => selection.ids.has(f.featureId));
  const optionalCount = [...selection.optional.values()].reduce((s, b) => s + b.size, 0);

  if (selectedById.length === 0 && optionalCount === 0) {
    return <p style={{ color: 'var(--color-text-muted)' }}>No features assigned.</p>;
  }
  return (
    <div>
      {selectedById.map((f) => (
        <span key={f.uuid} className="tag tag--primary" title={f.featureName}>
          {f.featureName}
        </span>
      ))}
      {optionalCount > 0 && (
        <span className="tag" title="Optional sub-features">
          +{optionalCount} optional
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

interface FormState {
  id: string;
  name: string;
  description: string;
  categoryId: ProductCategory;
  selection: FeatureSelection;
}

function ProductEditor({
  product,
  packages,
  mode,
  onClose,
  onSaved,
}: {
  product?: Product;
  packages: FeaturePackage[];
  mode: 'create' | 'edit';
  onClose: () => void;
  onSaved: (p: Product) => void;
}) {
  const [form, setForm] = useState<FormState>(() => ({
    id: product?.id ?? '',
    name: product?.name ?? '',
    description: product?.description ?? '',
    categoryId: product?.categoryId ?? 'Software',
    selection: parseFeatureSelection(product?.features),
  }));
  const [validation, setValidation] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [addProduct, addState] = useMutation<{ productAdd: Product }>(PRODUCT_ADD, {
    refetchQueries: [{ query: PRODUCTS_LIST }],
    awaitRefetchQueries: true,
  });
  const [updateProduct, updateState] = useMutation<{ productUpdate: Product }>(
    PRODUCT_UPDATE,
    { refetchQueries: [{ query: PRODUCTS_LIST }], awaitRefetchQueries: true },
  );

  const submitting = addState.loading || updateState.loading;

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (mode === 'create' && form.name.trim().replace(/\s+/g, '').length === 0) {
      errors.name = 'Name produces an empty product id';
    }
    setValidation(errors);
    return Object.keys(errors).length === 0;
  }

  async function onSubmit(e: import("react").FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    const input = {
      id: mode === 'edit' ? form.id : form.name.trim().replace(/\s+/g, ''),
      name: form.name.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      features: serializeFeatureSelection(form.selection),
    };
    try {
      if (mode === 'create') {
        const res = await addProduct({ variables: { input } });
        if (res.data?.productAdd) onSaved(res.data.productAdd);
      } else {
        const res = await updateProduct({ variables: { input } });
        if (res.data?.productUpdate) onSaved(res.data.productUpdate);
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  const readOnly = false;

  return (
    <form className="form" onSubmit={onSubmit} aria-busy={submitting}>
      <div className="panel__header">
        <h2 className="panel__title">{mode === 'create' ? 'New product' : 'Edit product'}</h2>
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
        <div className="form-field" style={{ flex: 2 }}>
          <label htmlFor="name">Product name</label>
          <input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            readOnly={readOnly}
            placeholder="Enter the product name"
          />
          {validation.name && <span className="error-text">{validation.name}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={form.categoryId}
            onChange={(e) =>
              setForm({ ...form, categoryId: e.target.value as ProductCategory })
            }
            disabled={readOnly}
          >
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
          </select>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          readOnly={readOnly}
        />
      </div>

      <h3 style={{ marginBottom: 0 }}>Features</h3>
      <div className="panel__subtitle">
        Select which features this product exposes (and which optional sub-features are
        available).
      </div>
      <FeaturePicker
        packages={packages}
        selection={form.selection}
        onChange={(selection) => setForm({ ...form, selection })}
      />
    </form>
  );
}

function FeaturePicker({
  packages,
  selection,
  onChange,
}: {
  packages: FeaturePackage[];
  selection: FeatureSelection;
  onChange: (s: FeatureSelection) => void;
}) {
  if (packages.length === 0) {
    return <p style={{ color: 'var(--color-text-muted)' }}>No feature packages defined.</p>;
  }
  return (
    <div>
      {packages.map((pkg) => (
        <details key={pkg.id} open style={{ marginBottom: 'var(--margin-s)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
            {pkg.name}{' '}
            <span className="panel__subtitle">({pkg.features.length})</span>
          </summary>
          <ul className="feature-tree">
            {pkg.features.map((f) => (
              <FeatureNode
                key={f.uuid}
                feature={f}
                selection={selection}
                onChange={onChange}
              />
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}

function FeatureNode({
  feature,
  selection,
  onChange,
}: {
  feature: Feature;
  selection: FeatureSelection;
  onChange: (s: FeatureSelection) => void;
}) {
  const checked = selection.ids.has(feature.featureId);
  return (
    <li>
      <label className="feature-tree__row">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onChange(toggleFeatureId(selection, feature.featureId))}
        />
        <span className="feature-tree__name">{feature.featureName}</span>
        <code className="feature-tree__badge">{feature.featureId}</code>
        {feature.optional && <span className="tag">optional</span>}
        {feature.isPermission && <span className="tag">permission</span>}
      </label>
      {feature.subFeatures.length > 0 && (
        <ul>
          {feature.subFeatures.map((c) => (
            <FeatureNode
              key={c.uuid}
              feature={c}
              selection={selection}
              onChange={onChange}
            />
          ))}
        </ul>
      )}
    </li>
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
