import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { MockLink, __resetMockStateForTests } from '../api/mock/server';
import {
  AUTHORIZATION_QUERY,
  PRODUCTS_LIST,
  PRODUCT_ADD,
  REMOVE_ELEMENTS,
  LICENSES_LIST,
  PAGES_DATA_QUERY,
} from '../api/graphql/operations';

function makeClient() {
  return new ApolloClient({
    link: ApolloLink.from([new MockLink()]),
    cache: new InMemoryCache({
      typePolicies: {
        ProductItem: { keyFields: ['id'] },
        LicenseItem: { keyFields: ['id'] },
      },
    }),
    defaultOptions: { query: { fetchPolicy: 'no-cache' } },
  });
}

describe('mock GraphQL backend', () => {
  beforeEach(() => __resetMockStateForTests());
  afterEach(() => __resetMockStateForTests());

  it('login succeeds with valid demo credentials', async () => {
    const client = makeClient();
    const res = await client.query({
      query: AUTHORIZATION_QUERY,
      variables: { input: { login: 'admin', password: 'admin' } },
    });
    expect(res.data?.Authorization.token).toMatch(/^mock-token-/);
    expect(res.data?.Authorization.username).toBe('admin');
    expect(res.data?.Authorization.permissions).toContain('AddProduct');
  });

  it('login fails with bad credentials', async () => {
    const client = makeClient();
    const res = await client.query({
      query: AUTHORIZATION_QUERY,
      variables: { input: { login: 'admin', password: 'nope' } },
      errorPolicy: 'all',
    });
    expect(res.errors?.[0]?.message).toMatch(/Invalid credentials/);
  });

  it('lists, adds and removes a product', async () => {
    const client = makeClient();
    const initial = await client.query({ query: PRODUCTS_LIST, variables: { input: {} } });
    const seedCount = initial.data.ProductsList.items.length;
    expect(seedCount).toBeGreaterThan(0);

    const add = await client.mutate({
      mutation: PRODUCT_ADD,
      variables: {
        input: {
          id: 'AcmeVision',
          item: {
            name: 'Acme Vision',
            productName: 'Acme Vision',
            description: 'test product',
            categoryId: 'Software',
            features: '',
          },
        },
      },
    });
    expect(add.data?.ProductAdd.id).toBe('AcmeVision');

    const after = await client.query({ query: PRODUCTS_LIST, variables: { input: {} } });
    expect(after.data.ProductsList.items.length).toBe(seedCount + 1);

    const removed = await client.mutate({
      mutation: REMOVE_ELEMENTS,
      variables: { input: { collectionId: 'products', elementIds: ['AcmeVision'] } },
    });
    expect(removed.data?.RemoveElements.success).toBe(true);

    const final = await client.query({ query: PRODUCTS_LIST, variables: { input: {} } });
    expect(final.data.ProductsList.items.length).toBe(seedCount);
  });

  it('lists licenses', async () => {
    const client = makeClient();
    const all = await client.query({
      query: LICENSES_LIST,
      variables: { input: {} },
    });
    expect(all.data.LicensesList.items.length).toBeGreaterThan(0);
  });

  it('stamps __typename on items', async () => {
    const client = makeClient();
    const res = await client.query({ query: PRODUCTS_LIST, variables: { input: {} } });
    const items = res.data.ProductsList.items;
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].__typename).toBe('ProductItem');
  });

  it('returns navigation pages via PagesData (drives the sidebar)', async () => {
    const client = makeClient();
    const res = await client.query({ query: PAGES_DATA_QUERY });
    const items = res.data.PagesData.items;
    const ids = items.map((p: { id: string }) => p.id);
    expect(ids).toEqual(expect.arrayContaining(['Products', 'Licenses', 'Features', 'Accounts']));
    const products = items.find((p: { id: string }) => p.id === 'Products');
    expect(products.source).toMatch(/GqlCollectionDocManagerPageView\.qml$/);
    expect(products.startItem).toMatch(/ProductsMultiDocView\.qml$/);
    expect(products.__typename).toBe('PageDataItem');
  });
});
