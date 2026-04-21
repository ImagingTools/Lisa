/**
 * In-memory mock backend.
 *
 * Implemented as a custom `ApolloLink` that resolves operations by
 * `operationName`. This avoids pulling in `@graphql-tools/schema` while
 * still keeping the request/response shape identical to a real Lisa
 * GraphQL server.
 *
 * Updated to match the real ImtCore SDL operations and shapes.
 */
import { ApolloLink, Observable, type FetchResult, type Operation } from '@apollo/client';
import type {
  ProductItem,
  ProductData,
  LicenseItem,
  LicenseDefinitionData,
  FeatureData,
  UserItemData,
  UserData,
  AuthorizationPayload,
} from '@/types/domain';
import {
  seedProducts,
  seedLicenses,
  seedFeatureItems,
  seedUsers,
  seedUserItems,
} from './seed';

type Mutable<T> = { -readonly [K in keyof T]: T[K] };

interface MockState {
  products: ProductItem[];
  licenses: LicenseItem[];
  features: FeatureData[];
  users: UserItemData[];
  currentAuthPayload: AuthorizationPayload | null;
}

const STORAGE_KEY = 'lisa-web.mock-state.v3';

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
    features: structuredClone(seedFeatureItems),
    users: structuredClone(seedUserItems),
    currentAuthPayload: null,
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

// ---------------------------------------------------------------------------
// Resolvers
// ---------------------------------------------------------------------------

type Resolver = (vars: Record<string, unknown>) => unknown;

const resolvers: Record<string, Resolver> = {
  // Auth (Authorization.sdl)
  Authorization: ({ input }) => {
    const { login, password } = input as { login: string; password: string };
    const match = seedUsers.find((u) => u.payload.username === login && u.password === password);
    if (!match) throw new Error('Invalid credentials');
    state.currentAuthPayload = { ...match.payload };
    persist(state);
    return {
      Authorization: state.currentAuthPayload,
    };
  },

  GetPermissions: ({ input }) => {
    const { accessToken } = input as { accessToken: string };
    // In a real system, validate the token; for mock, just return current user's perms
    if (!state.currentAuthPayload) {
      throw new Error('Not authenticated');
    }
    const user = seedUsers.find((u) => u.payload.token === accessToken);
    return {
      GetPermissions: {
        permissions: user?.permissions ?? [],
      },
    };
  },

  Logout: () => {
    state.currentAuthPayload = null;
    persist(state);
    return { Logout: { ok: true } };
  },

  // Products (Products.sdl)
  ProductsList: () => ({
    ProductsList: {
      items: state.products,
      notification: { pagesCount: 1, totalCount: state.products.length },
    },
  }),

  ProductItem: ({ input }) => {
    const { id } = input as { id: string };
    const product = state.products.find((p) => p.id === id);
    if (!product) throw new Error(`Product '${id}' not found`);
    const productData: ProductData = {
      id: product.id,
      name: product.name,
      productName: product.productName,
      description: product.description,
      productId: product.productId,
      categoryId: product.categoryId,
      features: product.features,
    };
    return { ProductItem: productData };
  },

  ProductAdd: ({ input }) => {
    const { item } = input as { id: string; item: ProductData };
    const id = item.id || item.name?.replace(/\s+/g, '') || crypto.randomUUID();
    if (state.products.some((p) => p.id === id)) {
      throw new Error(`Product '${id}' already exists`);
    }
    const newProduct: ProductItem = {
      id,
      name: item.name ?? '',
      productName: item.productName ?? item.name ?? '',
      typeId: 'Product',
      productId: item.productId ?? id,
      categoryId: item.categoryId ?? 'Software',
      description: item.description ?? '',
      features: item.features ?? '',
      licenses: [],
      added: now(),
      timeStamp: now(),
    };
    state.products.push(newProduct);
    persist(state);
    return { ProductAdd: { id } };
  },

  ProductUpdate: ({ input }) => {
    const { id: inputId, item } = input as { id: string; item: ProductData };
    const id = inputId || item.id;
    const product = state.products.find((p) => p.id === id);
    if (!product) throw new Error(`Product '${id}' not found`);
    Object.assign(product, {
      name: item.name ?? product.name,
      productName: item.productName ?? product.productName,
      description: item.description ?? product.description,
      categoryId: item.categoryId ?? product.categoryId,
      features: item.features ?? product.features,
      timeStamp: now(),
    });
    persist(state);
    return { ProductUpdate: { id } };
  },

  // Licenses (Licenses.sdl)
  LicensesList: () => ({
    LicensesList: {
      items: state.licenses,
      notification: { pagesCount: 1, totalCount: state.licenses.length },
    },
  }),

  LicenseItem: ({ input }) => {
    const { id } = input as { id: string };
    const license = state.licenses.find((l) => l.id === id);
    if (!license) throw new Error(`License '${id}' not found`);
    const licenseData: LicenseDefinitionData = {
      id: license.id,
      licenseName: license.licenseName,
      description: license.description,
      productId: license.productId,
      licenseId: license.licenseId,
      features: license.features,
      parentLicenses: license.parentLicenses,
    };
    return { LicenseItem: licenseData };
  },

  LicenseAdd: ({ input }) => {
    const { item } = input as { id: string; item: LicenseDefinitionData };
    const id = item.id || crypto.randomUUID();
    const newLicense: LicenseItem = {
      id,
      typeId: 'License',
      licenseId: item.licenseId ?? id,
      licenseName: item.licenseName ?? '',
      description: item.description ?? '',
      productId: item.productId,
      features: item.features,
      parentLicenses: item.parentLicenses,
      added: now(),
      timeStamp: now(),
    };
    state.licenses.push(newLicense);
    // Also update the product's embedded licenses array
    if (item.productId) {
      const product = state.products.find((p) => p.id === item.productId);
      if (product) {
        if (!product.licenses) product.licenses = [];
        product.licenses.push({
          id,
          name: item.licenseName,
          licenseId: item.licenseId ?? id,
          licenseName: item.licenseName,
        });
      }
    }
    persist(state);
    return { LicenseAdd: { id } };
  },

  LicenseUpdate: ({ input }) => {
    const { id: inputId, item } = input as { id: string; item: LicenseDefinitionData };
    const id = inputId || item.id;
    const license = state.licenses.find((l) => l.id === id);
    if (!license) throw new Error(`License '${id}' not found`);
    Object.assign(license, {
      licenseName: item.licenseName ?? license.licenseName,
      description: item.description ?? license.description,
      features: item.features ?? license.features,
      parentLicenses: item.parentLicenses ?? license.parentLicenses,
      timeStamp: now(),
    });
    // Update product's embedded license ref
    if (license.productId) {
      const product = state.products.find((p) => p.id === license.productId);
      const ref = product?.licenses?.find((r) => r.id === id);
      if (ref) {
        ref.name = license.licenseName;
        ref.licenseName = license.licenseName;
      }
    }
    persist(state);
    return { LicenseUpdate: { id } };
  },

  // Features (Features.sdl)
  FeaturesList: () => ({
    FeaturesList: {
      items: state.features.map((f) => ({
        id: f.id,
        name: f.name ?? f.featureName,
        featureName: f.featureName ?? '',
        typeId: 'Feature',
        featureId: f.featureId ?? '',
        description: f.description ?? '',
        optional: f.optional ?? false,
        isPermission: f.isPermission ?? false,
        dependencies: f.dependencies ?? '',
        added: now(),
        timeStamp: now(),
        subFeatures: f.subFeatures ?? [],
      })),
      notification: { pagesCount: 1, totalCount: state.features.length },
    },
  }),

  GetFeatureItem: ({ input }) => {
    const { id } = input as { id: string };
    const feature = state.features.find((f) => f.id === id);
    if (!feature) throw new Error(`Feature '${id}' not found`);
    return { GetFeatureItem: feature };
  },

  AddFeature: ({ input }) => {
    const { item } = input as { id: string; item: FeatureData };
    const id = item.id || crypto.randomUUID();
    const newFeature: FeatureData = {
      id,
      featureId: item.featureId ?? id,
      name: item.name ?? item.featureName,
      featureName: item.featureName ?? '',
      description: item.description,
      optional: item.optional ?? false,
      isPermission: item.isPermission ?? false,
      dependencies: item.dependencies ?? '',
      subFeatures: item.subFeatures ?? [],
    };
    state.features.push(newFeature);
    persist(state);
    return { AddFeature: { id } };
  },

  UpdateFeature: ({ input }) => {
    const { id: inputId, item } = input as { id: string; item: FeatureData };
    const id = inputId || item.id;
    const feature = state.features.find((f) => f.id === id);
    if (!feature) throw new Error(`Feature '${id}' not found`);
    Object.assign(feature, {
      featureId: item.featureId ?? feature.featureId,
      name: item.name ?? feature.name,
      featureName: item.featureName ?? feature.featureName,
      description: item.description ?? feature.description,
      optional: item.optional ?? feature.optional,
      isPermission: item.isPermission ?? feature.isPermission,
      dependencies: item.dependencies ?? feature.dependencies,
    });
    persist(state);
    return { UpdateFeature: { id } };
  },

  // Users (Users.sdl)
  UsersList: () => ({
    UsersList: {
      items: state.users,
      notification: { pagesCount: 1, totalCount: state.users.length },
    },
  }),

  UserItem: ({ input }) => {
    const { id } = input as { id: string };
    const user = state.users.find((u) => u.id === id);
    if (!user) throw new Error(`User '${id}' not found`);
    const userData: UserData = {
      id: user.id,
      name: user.name,
      username: user.userId,
      email: user.mail,
      groups: user.groups ? [user.groups] : [],
      roles: user.roles ? [user.roles] : [],
      permissions: [],
    };
    return { UserItem: userData };
  },

  UserAdd: ({ input }) => {
    const { item } = input as { id: string; item: UserData };
    const id = item.id || crypto.randomUUID();
    const newUser: UserItemData = {
      id,
      typeId: 'User',
      userId: item.username ?? id,
      name: item.name ?? '',
      description: '',
      mail: item.email ?? '',
      systemId: 'system-1',
      systemName: 'Lisa',
      roles: item.roles?.join(';'),
      groups: item.groups?.join(';'),
      added: now(),
      lastModified: now(),
    };
    state.users.push(newUser);
    persist(state);
    return { UserAdd: { id } };
  },

  UserUpdate: ({ input }) => {
    const { id: inputId, item } = input as { id: string; item: UserData };
    const id = inputId || item.id;
    const user = state.users.find((u) => u.id === id);
    if (!user) throw new Error(`User '${id}' not found`);
    Object.assign(user, {
      name: item.name ?? user.name,
      userId: item.username ?? user.userId,
      mail: item.email ?? user.mail,
      roles: item.roles?.join(';') ?? user.roles,
      groups: item.groups?.join(';') ?? user.groups,
      lastModified: now(),
    });
    persist(state);
    return { UserUpdate: { id } };
  },

  // Generic collection operations
  RemoveElements: ({ input }) => {
    const { collectionId, elementIds } = input as { collectionId: string; elementIds: string[] };
    let removed = 0;
    switch (collectionId) {
      case 'products':
        state.products = state.products.filter((p) => {
          if (elementIds.includes(p.id)) {
            removed++;
            return false;
          }
          return true;
        });
        break;
      case 'licenses':
        state.licenses = state.licenses.filter((l) => {
          if (elementIds.includes(l.id)) {
            removed++;
            // Also remove from product's embedded licenses
            const product = state.products.find((p) => p.id === l.productId);
            if (product?.licenses) {
              product.licenses = product.licenses.filter((r) => r.id !== l.id);
            }
            return false;
          }
          return true;
        });
        break;
      case 'features':
        state.features = state.features.filter((f) => {
          if (elementIds.includes(f.id ?? '')) {
            removed++;
            return false;
          }
          return true;
        });
        break;
      case 'users':
        state.users = state.users.filter((u) => {
          if (elementIds.includes(u.id)) {
            removed++;
            return false;
          }
          return true;
        });
        break;
      default:
        throw new Error(`Unknown collection '${collectionId}'`);
    }
    persist(state);
    return { RemoveElements: { success: removed > 0 } };
  },
};

/**
 * Field → concrete type name map, mirroring the SDL in `../graphql/schema.ts`.
 */
const FIELD_TYPES: Record<string, string> = {
  // Query
  'Query.Authorization': 'AuthorizationPayload',
  'Query.GetPermissions': 'PermissionList',
  'Query.ProductsList': 'ProductsListPayload',
  'Query.ProductItem': 'ProductData',
  'Query.LicensesList': 'LicensesListPayload',
  'Query.LicenseItem': 'LicenseDefinitionData',
  'Query.FeaturesList': 'FeaturesListPayload',
  'Query.GetFeatureItem': 'FeatureData',
  'Query.UsersList': 'UsersListPayload',
  'Query.UserItem': 'UserData',
  // Mutation
  'Mutation.Logout': 'LogoutPayload',
  'Mutation.ProductAdd': 'AddedNotificationPayload',
  'Mutation.ProductUpdate': 'UpdatedNotificationPayload',
  'Mutation.LicenseAdd': 'AddedNotificationPayload',
  'Mutation.LicenseUpdate': 'UpdatedNotificationPayload',
  'Mutation.AddFeature': 'AddedNotificationPayload',
  'Mutation.UpdateFeature': 'UpdatedNotificationPayload',
  'Mutation.UserAdd': 'AddedNotificationPayload',
  'Mutation.UserUpdate': 'UpdatedNotificationPayload',
  'Mutation.RemoveElements': 'RemoveElementsPayload',
  // Nested objects
  'ProductsListPayload.items': 'ProductItem',
  'ProductsListPayload.notification': 'NotificationItem',
  'ProductItem.licenses': 'LicenseData',
  'LicensesListPayload.items': 'LicenseItem',
  'LicensesListPayload.notification': 'NotificationItem',
  'FeaturesListPayload.items': 'FeatureItem',
  'FeaturesListPayload.notification': 'NotificationItem',
  'FeatureItem.subFeatures': 'FeatureData',
  'FeatureData.subFeatures': 'FeatureData',
  'UsersListPayload.items': 'UserItemData',
  'UsersListPayload.notification': 'NotificationItem',
  'UserData.systemInfos': 'SystemInfo',
};

function attachTypenames(parentType: string, value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) {
    return value.map((v) => attachTypenames(parentType, v));
  }
  if (typeof value !== 'object') return value;
  const obj = value as Record<string, unknown>;
  const out: Record<string, unknown> = { __typename: parentType };
  for (const [key, v] of Object.entries(obj)) {
    const childType = FIELD_TYPES[`${parentType}.${key}`];
    out[key] = childType ? attachTypenames(childType, v) : v;
  }
  return out;
}

function shape(
  name: string,
  operationKind: 'query' | 'mutation' | 'subscription',
  vars: Record<string, unknown>,
): unknown {
  const resolver = resolvers[name];
  if (!resolver) {
    throw new Error(`Mock backend has no resolver for operation '${name}'`);
  }
  const data = resolver(vars) as Record<string, unknown> | null | undefined;
  if (!data || typeof data !== 'object') return data;
  const rootType = operationKind === 'mutation' ? 'Mutation' : 'Query';
  const out: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(data)) {
    const childType = FIELD_TYPES[`${rootType}.${key}`];
    out[key] = childType ? attachTypenames(childType, v) : v;
  }
  return out;
}

const NETWORK_DELAY_MS = 80;

export class MockLink extends ApolloLink {
  request(operation: Operation): Observable<FetchResult> {
    return new Observable((observer) => {
      const opName = operation.operationName;
      const handle = setTimeout(() => {
        try {
          if (!opName) throw new Error('Operations must be named to use the mock backend');
          const def = operation.query.definitions.find(
            (d): d is import('graphql').OperationDefinitionNode =>
              d.kind === 'OperationDefinition',
          );
          const kind = (def?.operation ?? 'query') as 'query' | 'mutation' | 'subscription';
          const data = shape(opName, kind, operation.variables ?? {});
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

export function __resetMockStateForTests() {
  state.products = structuredClone(seedProducts);
  state.licenses = structuredClone(seedLicenses);
  state.features = structuredClone(seedFeatureItems);
  state.users = structuredClone(seedUserItems);
  state.currentAuthPayload = null;
  if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
}
