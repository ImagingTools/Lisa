import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { MockLink, __resetMockStateForTests } from '../api/mock/server';
import {
  LOGIN_MUTATION,
  PRODUCTS_LIST,
  PRODUCT_ADD,
  PRODUCT_REMOVE,
  LICENSES_LIST,
} from '../api/graphql/operations';

function makeClient() {
  return new ApolloClient({
    link: ApolloLink.from([new MockLink()]),
    cache: new InMemoryCache({
      typePolicies: {
        Product: { keyFields: ['id'] },
        License: { keyFields: ['productId', 'id'] },
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
    const res = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: { login: 'admin', password: 'admin' },
    });
    expect(res.data?.login.token).toMatch(/^mock-token-/);
    expect(res.data?.login.user.permissions).toContain('AddProduct');
  });

  it('login fails with bad credentials', async () => {
    const client = makeClient();
    const res = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: { login: 'admin', password: 'nope' },
      errorPolicy: 'all',
    });
    expect(res.errors?.[0]?.message).toMatch(/Invalid credentials/);
  });

  it('lists, adds and removes a product', async () => {
    const client = makeClient();
    const initial = await client.query({ query: PRODUCTS_LIST });
    const seedCount = initial.data.productsList.length;
    expect(seedCount).toBeGreaterThan(0);

    const add = await client.mutate({
      mutation: PRODUCT_ADD,
      variables: {
        input: {
          name: 'Acme Vision',
          description: 'test product',
          categoryId: 'Software',
          features: '',
        },
      },
    });
    expect(add.data?.productAdd.id).toBe('AcmeVision');

    const after = await client.query({ query: PRODUCTS_LIST });
    expect(after.data.productsList.length).toBe(seedCount + 1);

    const removed = await client.mutate({
      mutation: PRODUCT_REMOVE,
      variables: { id: 'AcmeVision' },
    });
    expect(removed.data?.productRemove).toBe(true);

    const final = await client.query({ query: PRODUCTS_LIST });
    expect(final.data.productsList.length).toBe(seedCount);
  });

  it('filters licenses by product id', async () => {
    const client = makeClient();
    const all = await client.query({
      query: LICENSES_LIST,
      variables: { productId: null },
    });
    expect(all.data.licensesList.length).toBeGreaterThan(0);

    const rt = await client.query({
      query: LICENSES_LIST,
      variables: { productId: 'RTVision.3d' },
    });
    expect(rt.data.licensesList.every((l: { productId: string }) => l.productId === 'RTVision.3d'),
    ).toBe(true);
  });
});
