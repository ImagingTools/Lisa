/**
 * Lisa-flavoured HTTP link for Apollo Client.
 *
 * The Lisa GraphQL server expects requests in a non-standard form, and we want
 * to avoid CORS preflight requests (the user explicitly requested POST, not
 * OPTIONS). Differences vs. the stock `HttpLink`:
 *
 *  1. **No CORS preflight.** Requests are sent with `Content-Type: text/plain`
 *     (a CORS-safelisted value) and no custom headers, so browsers treat them
 *     as "simple requests" and skip the OPTIONS roundtrip. Auth tokens are
 *     conveyed inside the GraphQL document (most Lisa operations already take
 *     `accessToken` as an argument) rather than via an `Authorization` header.
 *
 *  2. **Inlined variables.** The body is `{ "query": "<inlined operation>" }`
 *     with no `variables` or `operationName`. Variable references in the AST
 *     are substituted with literal values prior to printing, so the wire
 *     payload looks like:
 *
 *         query Authorization {
 *           Authorization(input: {login: "su", password: "1", productId: "ProLife"}) { ... }
 *         }
 *
 * This matches the request shape the Lisa server is configured to accept.
 */
import { ApolloLink, Observable, type FetchResult, type Operation } from '@apollo/client';
import {
  Kind,
  print,
  visit,
  type ASTNode,
  type DocumentNode,
  type ValueNode,
} from 'graphql';

export interface InlineHttpLinkOptions {
  uri: string;
  /** Optional fetch implementation (mainly for tests). */
  fetch?: typeof fetch;
}

/** Convert a runtime JS value into a GraphQL AST literal value. */
function jsToValueNode(value: unknown): ValueNode {
  if (value === null || value === undefined) {
    return { kind: Kind.NULL };
  }
  if (typeof value === 'boolean') {
    return { kind: Kind.BOOLEAN, value };
  }
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? { kind: Kind.INT, value: String(value) }
      : { kind: Kind.FLOAT, value: String(value) };
  }
  if (typeof value === 'string') {
    return { kind: Kind.STRING, value, block: false };
  }
  if (Array.isArray(value)) {
    return { kind: Kind.LIST, values: value.map(jsToValueNode) };
  }
  if (typeof value === 'object') {
    return {
      kind: Kind.OBJECT,
      fields: Object.entries(value as Record<string, unknown>).map(([name, v]) => ({
        kind: Kind.OBJECT_FIELD,
        name: { kind: Kind.NAME, value: name },
        value: jsToValueNode(v),
      })),
    };
  }
  // Fallback: stringify unknown types.
  return { kind: Kind.STRING, value: String(value), block: false };
}

/** Inline `$variables` into the query AST and strip variable definitions. */
export function inlineVariables(
  document: DocumentNode,
  variables: Record<string, unknown> | undefined,
): DocumentNode {
  const vars = variables ?? {};
  return visit(document, {
    Variable(node) {
      if (Object.prototype.hasOwnProperty.call(vars, node.name.value)) {
        return jsToValueNode(vars[node.name.value]);
      }
      return undefined;
    },
    OperationDefinition(node) {
      if (!node.variableDefinitions || node.variableDefinitions.length === 0) {
        return undefined;
      }
      return { ...node, variableDefinitions: [] };
    },
  }) as ASTNode as DocumentNode;
}

export function createInlineHttpLink(options: InlineHttpLinkOptions): ApolloLink {
  const fetchImpl: typeof fetch = options.fetch ?? globalThis.fetch.bind(globalThis);

  return new ApolloLink((operation: Operation) => {
    return new Observable<FetchResult>((observer) => {
      const inlined = inlineVariables(operation.query, operation.variables);
      const body = JSON.stringify({ query: print(inlined) });
      const controller =
        typeof AbortController !== 'undefined' ? new AbortController() : undefined;

      // `text/plain` keeps the request CORS-safelisted (no preflight). We
      // intentionally do NOT forward the `headers` Apollo context — adding
      // `Authorization` (or any non-safelisted header) would force an
      // OPTIONS preflight, which the user explicitly does not want.
      fetchImpl(options.uri, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        signal: controller?.signal,
      })
        .then(async (response) => {
          const text = await response.text();
          let payload: FetchResult;
          try {
            payload = text ? (JSON.parse(text) as FetchResult) : {};
          } catch {
            throw new Error(
              `Invalid GraphQL response (HTTP ${response.status}): ${text.slice(0, 200)}`,
            );
          }
          if (!response.ok && !payload.errors) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
          observer.next(payload);
          observer.complete();
        })
        .catch((err: unknown) => {
          observer.error(err instanceof Error ? err : new Error(String(err)));
        });

      return () => controller?.abort();
    });
  });
}
