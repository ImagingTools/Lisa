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
  InMemoryCache,
  type DefaultOptions,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createInlineHttpLink } from './inlineHttpLink';
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

  // When `VITE_LISA_GRAPHQL_URL` is an absolute URL we route the request
  // through the same-origin pathname so the Vite dev server proxy
  // (configured in `vite.config.ts`) forwards it. This avoids CORS entirely
  // — the browser sees a same-origin POST. In production builds without a
  // proxy, callers can pass a fully-qualified `uri` directly.
  let endpoint = uri!;
  try {
    const parsed = new URL(uri!);
    if (typeof window !== 'undefined' && parsed.origin !== window.location.origin) {
      endpoint = parsed.pathname + parsed.search;
    }
  } catch {
    // Treat as relative path; use as-is.
  }

  const transport = useMock
    ? new MockLink()
    : createInlineHttpLink({ uri: endpoint });

  // Note: we deliberately do NOT add an `Authorization` header link here.
  // The Lisa server expects auth tokens inline in the GraphQL document
  // (e.g. `Logout(input: {accessToken: "..."}`), and adding a custom
  // header would force a CORS preflight (OPTIONS) request, which we want
  // to avoid. `getToken` is accepted for backwards-compatibility but is
  // currently unused.
  void options.getToken;

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
      PageDataItem: { keyFields: ['id'] },
    },
  });

  return new ApolloClient({
    link: ApolloLink.from([errorLink, transport]),
    cache,
    defaultOptions,
    connectToDevTools: env?.MODE === 'development',
    name: 'lisa-web',
  });
}
