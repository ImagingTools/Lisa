import { describe, expect, it, vi } from 'vitest';
import { gql } from '@apollo/client';
import { execute } from '@apollo/client/link/core';
import { print } from 'graphql';
import { createInlineHttpLink, inlineVariables } from '../api/inlineHttpLink';

describe('inlineVariables', () => {
  it('inlines scalar and object variables and removes variable definitions', () => {
    const doc = gql`
      query Authorization($input: AuthorizationInput!) {
        Authorization(input: $input) {
          token
        }
      }
    `;
    const inlined = inlineVariables(doc, {
      input: { login: 'su', password: '1', productId: 'ProLife' },
    });
    const printed = print(inlined).replace(/\s+/g, ' ').trim();
    expect(printed).toBe(
      'query Authorization { Authorization(input: {login: "su", password: "1", productId: "ProLife"}) { token } }',
    );
    expect(printed).not.toContain('$input');
  });
});

describe('createInlineHttpLink', () => {
  it('POSTs {query} with text/plain content-type and no Authorization header', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ data: { Authorization: { token: 't' } } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    const link = createInlineHttpLink({ uri: 'https://lisa.example/graphql', fetch: fetchMock });
    const result = await new Promise((resolve, reject) => {
      execute(link, {
        query: gql`
          query Authorization($input: AuthorizationInput!) {
            Authorization(input: $input) {
              token
            }
          }
        `,
        variables: { input: { login: 'su', password: '1' } },
      }).subscribe({ next: resolve, error: reject });
    });

    expect(result).toEqual({ data: { Authorization: { token: 't' } } });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, { method: string; headers: Record<string, string>; body: string }];
    expect(url).toBe('https://lisa.example/graphql');
    expect(init.method).toBe('POST');
    const headers = init.headers;
    expect(headers['Content-Type']).toBe('text/plain;charset=UTF-8');
    expect(headers.Authorization).toBeUndefined();
    const body = JSON.parse(init.body);
    expect(Object.keys(body)).toEqual(['query']);
    expect(body.query).toContain('Authorization(input: {login: "su", password: "1"})');
    expect(body.variables).toBeUndefined();
    expect(body.operationName).toBeUndefined();
  });
});
