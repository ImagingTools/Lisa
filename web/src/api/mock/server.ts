/**
 * In-memory mock backend.
 *
 * Implemented as a custom `ApolloLink` that resolves operations by
 * `operationName`. This avoids pulling in `@graphql-tools/schema` while
 * still keeping the request/response shape identical to a real Lisa
 * GraphQL server. Swap `MockLink` for an `HttpLink` (and a
 * `WebSocketLink` for subscriptions) to talk to the real backend.
 */
import { ApolloLink, Observable, type FetchResult, type Operation } from '@apollo/client';
import type {
  Account,
  Feature,
  FeaturePackage,
  License,
  Product,
  SessionUser,
} from '@/types/domain';
import { seedAccounts, seedLicenses, seedPackages, seedProducts, seedUsers } from './seed';

type Mutable<T> = { -readonly [K in keyof T]: T[K] };

interface MockState {
  products: Product[];
  licenses: License[];
  packages: FeaturePackage[];
  accounts: Account[];
  currentUser: SessionUser | null;
}

const STORAGE_KEY = 'lisa-web.mock-state.v1';

function loadState(): MockState {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as MockState;
    } catch {
      /* ignore corrupted state */
    }
  }
  return {
    products: structuredClone(seedProducts),
    licenses: structuredClone(seedLicenses),
    packages: structuredClone(seedPackages),
    accounts: structuredClone(seedAccounts),
    currentUser: null,
  };
}

function persist(state: MockState) {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota exhausted etc — ignore */
    }
  }
}

const state: Mutable<MockState> = loadState();

const now = () => new Date().toISOString();

function nextRevision(meta: { revision: number; lastModified: string }) {
  meta.revision += 1;
  meta.lastModified = now();
}

function flattenFeatures(pkgs: FeaturePackage[]): Feature[] {
  const out: Feature[] = [];
  const walk = (f: Feature) => {
    out.push(f);
    f.subFeatures.forEach(walk);
  };
  pkgs.forEach((p) => p.features.forEach(walk));
  return out;
}

function findFeatureByUuid(uuid: string): Feature | null {
  for (const p of state.packages) {
    for (const f of p.features) {
      const found = walkFind(f, (x) => x.uuid === uuid);
      if (found) return found;
    }
  }
  return null;
}

function walkFind(node: Feature, pred: (f: Feature) => boolean): Feature | null {
  if (pred(node)) return node;
  for (const c of node.subFeatures) {
    const r = walkFind(c, pred);
    if (r) return r;
  }
  return null;
}

function removeFeatureByUuid(uuid: string): boolean {
  for (const p of state.packages) {
    if (p.features.some((f) => f.uuid === uuid)) {
      p.features = p.features.filter((f) => f.uuid !== uuid);
      return true;
    }
    for (const f of p.features) {
      if (removeFromTree(f, uuid)) return true;
    }
  }
  return false;
}

function removeFromTree(node: Feature, uuid: string): boolean {
  if (node.subFeatures.some((c) => c.uuid === uuid)) {
    node.subFeatures = node.subFeatures.filter((c) => c.uuid !== uuid);
    return true;
  }
  return node.subFeatures.some((c) => removeFromTree(c, uuid));
}

// ---------------------------------------------------------------------------
// Resolvers
// ---------------------------------------------------------------------------

type Resolver = (vars: Record<string, unknown>) => unknown;

const resolvers: Record<string, Resolver> = {
  Me: () => ({ me: state.currentUser }),

  Login: ({ login, password }) => {
    const match = seedUsers.find(
      (u) => u.user.login === String(login) && u.password === String(password),
    );
    if (!match) {
      throw new Error('Invalid credentials');
    }
    state.currentUser = { ...match.user, lastConnection: now() };
    persist(state);
    return {
      login: { user: state.currentUser, token: `mock-token-${state.currentUser.id}` },
    };
  },

  Logout: () => {
    state.currentUser = null;
    persist(state);
    return { logout: true };
  },

  // Products -----------------------------------------------------------------
  ProductsList: () => ({ productsList: state.products }),
  ProductItem: ({ id }) => ({
    productItem: state.products.find((p) => p.id === id) ?? null,
  }),
  ProductAdd: ({ input }) => {
    const i = input as Partial<Product> & {
      id?: string;
      name: string;
      categoryId: Product['categoryId'];
      features: string;
      description?: string;
    };
    const id = i.id || i.name.replace(/\s+/g, '');
    if (state.products.some((p) => p.id === id)) {
      throw new Error(`Product '${id}' already exists`);
    }
    const product: Product = {
      id,
      name: i.name,
      description: i.description ?? '',
      categoryId: i.categoryId,
      features: i.features ?? '',
      licenses: [],
      meta: {
        uuid: `p-${id}-${Date.now()}`,
        typeId: 'Product',
        created: now(),
        lastModified: now(),
        owner: state.currentUser?.login ?? 'system',
        revision: 1,
      },
    };
    state.products.push(product);
    persist(state);
    return { productAdd: product };
  },
  ProductUpdate: ({ input }) => {
    const i = input as Partial<Product> & { id: string };
    const product = state.products.find((p) => p.id === i.id);
    if (!product) throw new Error(`Product '${i.id}' not found`);
    Object.assign(product, {
      name: i.name ?? product.name,
      description: i.description ?? product.description,
      categoryId: i.categoryId ?? product.categoryId,
      features: i.features ?? product.features,
    });
    nextRevision(product.meta);
    persist(state);
    return { productUpdate: product };
  },
  ProductRemove: ({ id }) => {
    const before = state.products.length;
    state.products = state.products.filter((p) => p.id !== id);
    state.licenses = state.licenses.filter((l) => l.productId !== id);
    persist(state);
    return { productRemove: state.products.length < before };
  },

  // Licenses -----------------------------------------------------------------
  LicensesList: ({ productId }) => ({
    licensesList: productId
      ? state.licenses.filter((l) => l.productId === productId)
      : state.licenses,
  }),
  LicenseItem: ({ id, productId }) => ({
    licenseItem: state.licenses.find((l) => l.id === id && l.productId === productId) ?? null,
  }),
  LicenseAdd: ({ input }) => {
    const i = input as Omit<License, 'meta'> & { id?: string };
    const id = i.id || crypto.randomUUID();
    const license: License = {
      id,
      productId: i.productId,
      name: i.name,
      description: i.description ?? '',
      features: i.features ?? [],
      meta: {
        uuid: `l-${id}-${Date.now()}`,
        typeId: 'License',
        created: now(),
        lastModified: now(),
        owner: state.currentUser?.login ?? 'system',
        revision: 1,
      },
    };
    state.licenses.push(license);
    const product = state.products.find((p) => p.id === license.productId);
    if (product && !product.licenses.some((r) => r.id === license.id)) {
      product.licenses.push({ id: license.id, name: license.name });
      nextRevision(product.meta);
    }
    persist(state);
    return { licenseAdd: license };
  },
  LicenseUpdate: ({ input }) => {
    const i = input as Omit<License, 'meta'> & { id: string };
    const license = state.licenses.find((l) => l.id === i.id && l.productId === i.productId);
    if (!license) throw new Error(`License '${i.id}' not found`);
    Object.assign(license, {
      name: i.name ?? license.name,
      description: i.description ?? license.description,
      features: i.features ?? license.features,
    });
    nextRevision(license.meta);
    const product = state.products.find((p) => p.id === license.productId);
    const ref = product?.licenses.find((r) => r.id === license.id);
    if (ref) ref.name = license.name;
    persist(state);
    return { licenseUpdate: license };
  },
  LicenseRemove: ({ id, productId }) => {
    const before = state.licenses.length;
    state.licenses = state.licenses.filter(
      (l) => !(l.id === id && l.productId === productId),
    );
    const product = state.products.find((p) => p.id === productId);
    if (product) product.licenses = product.licenses.filter((r) => r.id !== id);
    persist(state);
    return { licenseRemove: state.licenses.length < before };
  },

  // Features -----------------------------------------------------------------
  PackagesList: () => ({ packagesList: state.packages }),
  FeaturesList: () => ({ featuresList: flattenFeatures(state.packages) }),
  FeatureItem: ({ uuid }) => ({ featureItem: findFeatureByUuid(String(uuid)) }),
  GetFeatureDependencies: ({ featureId }) => {
    const all = flattenFeatures(state.packages);
    const target = all.find((f) => f.featureId === featureId);
    return { getFeatureDependencies: target?.dependencies ?? [] };
  },
  FeatureAdd: ({ input }) => {
    const i = input as Partial<Feature> & {
      featureId: string;
      featureName: string;
      packageId: string;
      parentFeatureUuid?: string | null;
    };
    const newFeature: Feature = {
      uuid: i.uuid || crypto.randomUUID(),
      featureId: i.featureId,
      featureName: i.featureName,
      description: i.description,
      packageId: i.packageId,
      optional: i.optional ?? false,
      isPermission: i.isPermission ?? false,
      dependencies: i.dependencies ?? [],
      subFeatures: [],
    };
    const pkg = state.packages.find((p) => p.id === i.packageId);
    if (!pkg) throw new Error(`Unknown package '${i.packageId}'`);
    if (i.parentFeatureUuid) {
      const parent = findFeatureByUuid(i.parentFeatureUuid);
      if (!parent) throw new Error(`Parent feature '${i.parentFeatureUuid}' not found`);
      parent.subFeatures.push(newFeature);
    } else {
      pkg.features.push(newFeature);
    }
    persist(state);
    return { featureAdd: newFeature };
  },
  FeatureUpdate: ({ input }) => {
    const i = input as Partial<Feature> & { uuid: string };
    const target = findFeatureByUuid(i.uuid);
    if (!target) throw new Error(`Feature '${i.uuid}' not found`);
    Object.assign(target, {
      featureId: i.featureId ?? target.featureId,
      featureName: i.featureName ?? target.featureName,
      description: i.description ?? target.description,
      optional: i.optional ?? target.optional,
      isPermission: i.isPermission ?? target.isPermission,
      dependencies: i.dependencies ?? target.dependencies,
    });
    persist(state);
    return { featureUpdate: target };
  },
  FeatureRemove: ({ uuid }) => {
    const removed = removeFeatureByUuid(String(uuid));
    persist(state);
    return { featureRemove: removed };
  },

  // Accounts -----------------------------------------------------------------
  AccountsList: () => ({ accountsList: state.accounts }),
};

/**
 * Restrict the response to only the fields the operation actually selected.
 *
 * Apollo Client validates that every selected field exists on the returned
 * data object, but unrequested fields would produce harmless extras. We
 * still keep the resolver outputs whole for simplicity and let Apollo's
 * normalised cache pick what it needs.
 */
function shape(name: string, vars: Record<string, unknown>): unknown {
  const resolver = resolvers[name];
  if (!resolver) {
    throw new Error(`Mock backend has no resolver for operation '${name}'`);
  }
  return resolver(vars);
}

/** Network latency added to every operation to surface loading states. */
const NETWORK_DELAY_MS = 80;

export class MockLink extends ApolloLink {
  request(operation: Operation): Observable<FetchResult> {
    return new Observable((observer) => {
      const opName = operation.operationName;
      const handle = setTimeout(() => {
        try {
          if (!opName) throw new Error('Operations must be named to use the mock backend');
          const data = shape(opName, operation.variables ?? {});
          observer.next({ data: data as Record<string, unknown> });
          observer.complete();
        } catch (err) {
          observer.next({
            errors: [{ message: err instanceof Error ? err.message : String(err) }],
          } as FetchResult);
          observer.complete();
        }
      }, NETWORK_DELAY_MS);
      return () => clearTimeout(handle);
    });
  }
}

/** Useful in tests to reset the in-memory state. */
export function __resetMockStateForTests() {
  state.products = structuredClone(seedProducts);
  state.licenses = structuredClone(seedLicenses);
  state.packages = structuredClone(seedPackages);
  state.accounts = structuredClone(seedAccounts);
  state.currentUser = null;
  if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
}
