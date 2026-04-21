/**
 * Products feature module.
 *
 * QML correspondence:
 *   - `ImtCore/Qml/imtlicgui/ProductCollectionView.qml`            → ProductsCollection
 *   - `ImtCore/Qml/imtlicgui/ProductView.qml`                      → ProductEditor
 *   - `ImtCore/Qml/imtlicgui/ProductCollectionViewCommandsDelegate` → toolbar
 *
 * Layout:
 *   - The page uses `PageTabs`. The first tab is the collection (DataTable
 *     of products + MetaInfo side panel). Double-clicking a row opens the
 *     editor in a new closable tab; "+ New product" opens an empty editor
 *     in a new tab. This mirrors the IDE-style multi-document workflow
 *     used by the QML `MultiDocCollectionPage`.
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
import { DataTable, type Column } from '@/components/DataTable';
import { COLLECTION_TAB_ID, PageTabs, usePageTabs } from '@/components/PageTabs';
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

const NEW_TAB_ID = 'new:product';
const editorTabId = (id: string) => `editor:${id}`;

export function ProductsPage() {
  const { hasPermission } = useSession();
  const { data, loading, error, refetch } = useQuery<ProductsListData>(PRODUCTS_LIST);
  const { data: pkgData } = useQuery<PackagesListData>(PACKAGES_LIST);
  const tabs = usePageTabs('products', 'Products');

  if (loading && !data) return <CenteredSpinner label="Loading products…" />;

  const products = data?.productsList ?? [];
  const packages = pkgData?.packagesList ?? [];

  const findProduct = (id: string) => products.find((p) => p.id === id) ?? null;

  return (
    <PageTabs
      api={tabs}
      renderTab={(tabId) => {
        if (tabId === COLLECTION_TAB_ID) {
          return (
            <ProductsCollection
              products={products}
              error={error?.message}
              onRetry={() => refetch()}
              canCreate={hasPermission('AddProduct')}
              onActivate={(p) =>
                tabs.openTab({
                  id: editorTabId(p.id),
                  title: p.name,
                  subtitle: p.id,
                })
              }
              onCreate={() =>
                tabs.openTab({ id: NEW_TAB_ID, title: 'New product' })
              }
            />
          );
        }
        if (tabId === NEW_TAB_ID) {
          return (
            <ProductEditor
              packages={packages}
              mode="create"
              onClose={() => tabs.closeTab(NEW_TAB_ID)}
              onSaved={(saved) =>
                tabs.replaceTab(NEW_TAB_ID, {
                  id: editorTabId(saved.id),
                  title: saved.name,
                  subtitle: saved.id,
                  closable: true,
                })
              }
            />
          );
        }
        // editor tab — id format `editor:<productId>`
        const productId = tabId.startsWith('editor:') ? tabId.slice('editor:'.length) : '';
        const product = findProduct(productId);
        if (!product) {
          return (
            <EmptyState
              title="Product not found"
              message="This product no longer exists. Close this tab to dismiss it."
            />
          );
        }
        return (
          <ProductEditor
            product={product}
            packages={packages}
            mode="edit"
            onClose={() => tabs.closeTab(tabId)}
            onSaved={(saved) =>
              tabs.renameTab(tabId, { title: saved.name, subtitle: saved.id })
            }
            onDeleted={() => tabs.closeTab(tabId)}
          />
        );
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Collection tab — DataTable + MetaInfo side panel
// ---------------------------------------------------------------------------

function ProductsCollection({
  products,
  error,
  onRetry,
  canCreate,
  onActivate,
  onCreate,
}: {
  products: Product[];
  error?: string;
  onRetry: () => void;
  canCreate: boolean;
  onActivate: (p: Product) => void;
  onCreate: () => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [products, search]);

  const selected = (selectedId && products.find((p) => p.id === selectedId)) || null;

  const columns: Column<Product>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Name',
        cell: (p) => p.name,
        sortValue: (p) => p.name.toLowerCase(),
        width: 240,
      },
      {
        key: 'id',
        header: 'Id',
        cell: (p) => <code>{p.id}</code>,
        sortValue: (p) => p.id.toLowerCase(),
        width: 180,
      },
      {
        key: 'category',
        header: 'Category',
        cell: (p) => <span className="tag">{p.categoryId}</span>,
        sortValue: (p) => p.categoryId,
        width: 140,
      },
      {
        key: 'description',
        header: 'Description',
        cell: (p) => p.description,
        sortValue: (p) => p.description.toLowerCase(),
        width: 320,
      },
      {
        key: 'licenses',
        header: 'Licenses',
        cell: (p) => p.licenses.length,
        sortValue: (p) => p.licenses.length,
        width: 100,
      },
    ],
    [],
  );

  return (
    <>
      <div className="page-header">
        <div className="page-toolbar" style={{ flex: 1 }}>
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
            disabled={!canCreate}
            onClick={onCreate}
            title={canCreate ? undefined : 'Requires AddProduct'}
          >
            + New product
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          Failed to load products: {error}{' '}
          <button className="btn btn--small" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}

      <div className="collection-layout">
        <div className="panel" style={{ padding: 0 }}>
          <DataTable<Product>
            tableId="products"
            ariaLabel="Products list"
            columns={columns}
            rows={filtered}
            rowKey={(p) => p.id}
            selectedKey={selectedId}
            onSelect={(p) => setSelectedId(p.id)}
            onActivate={onActivate}
            emptyMessage={search ? 'No products match your filter.' : 'No products defined.'}
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
                <code>{selected.id}</code>
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

// ---------------------------------------------------------------------------
// Editor (also handles "view" via the embedded summary)
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
  onDeleted,
}: {
  product?: Product;
  packages: FeaturePackage[];
  mode: 'create' | 'edit';
  onClose: () => void;
  onSaved: (p: Product) => void;
  onDeleted?: () => void;
}) {
  const { hasPermission } = useSession();
  const [form, setForm] = useState<FormState>(() => ({
    id: product?.id ?? '',
    name: product?.name ?? '',
    description: product?.description ?? '',
    categoryId: product?.categoryId ?? 'Software',
    selection: parseFeatureSelection(product?.features),
  }));
  const [validation, setValidation] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [addProduct, addState] = useMutation<{ productAdd: Product }>(PRODUCT_ADD, {
    refetchQueries: [{ query: PRODUCTS_LIST }],
    awaitRefetchQueries: true,
  });
  const [updateProduct, updateState] = useMutation<{ productUpdate: Product }>(
    PRODUCT_UPDATE,
    { refetchQueries: [{ query: PRODUCTS_LIST }], awaitRefetchQueries: true },
  );
  const [removeProduct, removeState] = useMutation(PRODUCT_REMOVE, {
    refetchQueries: [{ query: PRODUCTS_LIST }],
    awaitRefetchQueries: true,
  });

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

  async function onSubmit(e: import('react').FormEvent) {
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
        if (res.data?.productAdd) {
          setForm((f) => ({ ...f, id: res.data!.productAdd.id }));
          onSaved(res.data.productAdd);
        }
      } else {
        const res = await updateProduct({ variables: { input } });
        if (res.data?.productUpdate) onSaved(res.data.productUpdate);
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  const canEdit = mode === 'create' || hasPermission('ChangeProduct');
  const canDelete = mode === 'edit' && hasPermission('RemoveProduct');

  return (
    <form className="form" onSubmit={onSubmit} aria-busy={submitting}>
      <div className="panel__header">
        <div>
          <h2 className="panel__title">
            {mode === 'create' ? 'New product' : form.name || 'Edit product'}
          </h2>
          {mode === 'edit' && (
            <div className="panel__subtitle">
              <code>{form.id}</code> · {form.categoryId}
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
        <div className="form-field" style={{ flex: 2 }}>
          <label htmlFor="name">Product name</label>
          <input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={!canEdit}
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
            disabled={!canEdit}
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
          disabled={!canEdit}
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

      {mode === 'edit' && product && (
        <>
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
          <h3>Metadata</h3>
          <MetaInfoPanel meta={product.meta} />
        </>
      )}

      {mode === 'edit' && product && (
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
            onDeleted?.();
          }}
        />
      )}
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
