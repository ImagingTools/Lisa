/**
 * Apollo Client factory.
 *
 * The transport is selected at runtime:
 *   - `VITE_LISA_GRAPHQL_URL` set        → real HttpLink (Lisa server).
 *   - otherwise                          → in-memory `MockLink`.
 *
 * The cache uses normalised type policies aligned with Lisa's compound
 * keys (e.g. `License` is keyed by `(productId, id)`, mirroring the
 * `ProductLicenses` PK in `CreateTables.sql`).
 */
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  type DefaultOptions,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { MockLink } from './mock/server';

export interface ClientOptions {
  /** Override the GraphQL endpoint (otherwise read from `import.meta.env`). */
  uri?: string;
  /** Force the in-memory mock link. */
  forceMock?: boolean;
  /** Provide a token reader so we don't take a hard dep on auth here. */
  getToken?: () => string | null;
}

const defaultOptions: DefaultOptions = {
  watchQuery: { fetchPolicy: 'cache-and-network', errorPolicy: 'all' },
  query: { fetchPolicy: 'network-only', errorPolicy: 'all' },
  mutate: { errorPolicy: 'all' },
};

export function createApolloClient(options: ClientOptions = {}) {
  const env = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env;
  const uri = options.uri ?? env?.VITE_LISA_GRAPHQL_URL;
  const useMock = options.forceMock || !uri;

  const transport = useMock
    ? new MockLink()
    : new HttpLink({ uri, credentials: 'include' });

  const authLink = setContext((_op, { headers }) => {
    const token = options.getToken?.();
    return {
      headers: {
        ...(headers as Record<string, string> | undefined),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        // eslint-disable-next-line no-console
        console.warn(`[gql:${operation.operationName}]`, err.message);
      }
    }
    if (networkError) {
      // eslint-disable-next-line no-console
      console.warn(`[network:${operation.operationName}]`, networkError.message);
    }
  });

  const cache = new InMemoryCache({
    typePolicies: {
      ProductItem: { keyFields: ['id'] },
      ProductData: { keyFields: ['id'] },
      LicenseItem: { keyFields: ['id'] },
      LicenseDefinitionData: { keyFields: ['id'] },
      LicenseData: { keyFields: ['id'] },
      FeatureItem: { keyFields: ['id'] },
      FeatureData: { keyFields: ['id'] },
      UserItemData: { keyFields: ['id'] },
      UserData: { keyFields: ['id'] },
      RoleItemData: { keyFields: ['id'] },
      RoleData: { keyFields: ['id'] },
      GroupItemData: { keyFields: ['id'] },
      GroupData: { keyFields: ['id'] },
    },
  });

  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, transport]),
    cache,
    defaultOptions,
    connectToDevTools: env?.MODE === 'development',
    name: 'lisa-web',
  });
}
