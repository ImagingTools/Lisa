/**
 * Auth context and `useSession` hook.
 *
 * Conceptually mirrors the QML `AuthorizationController` and
 * `PermissionsController`. The session is held in React state and persisted
 * to `localStorage` so a refresh keeps the user logged in (matching the
 * QML "remember login" behaviour that the desktop client provides via Qt
 * settings).
 *
 * Auth flow (using real ImtCore SDL):
 *  - login: calls `Authorization` Query with {login, password}
 *  - returns `AuthorizationPayload {userId, username, token, refreshToken,
 *    systemId, permissions}` where `permissions` is a delimited string
 *  - logout: calls `Logout` Mutation with {accessToken}
 *  - on boot: restore from localStorage and optionally call `GetPermissions`
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useApolloClient, useMutation } from '@apollo/client';
import {
  AUTHORIZATION_QUERY,
  LOGOUT_MUTATION,
  GET_PERMISSIONS_QUERY,
} from '@/api/graphql/operations';
import type { AuthorizationPayload, PermissionId } from '@/types/domain';

const AUTH_PAYLOAD_KEY = 'lisa-web.auth-payload';

interface SessionContextValue {
  /** Current authenticated user information (from AuthorizationPayload) */
  authPayload: AuthorizationPayload | null;
  /** Convenience: username from authPayload */
  username: string | null;
  /** Access token for API calls */
  token: string | null;
  /** Permission IDs granted to the user */
  permissions: string[];
  loading: boolean;
  error: string | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (perm: PermissionId | string) => boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(AUTH_PAYLOAD_KEY);
  if (!stored) return null;
  try {
    const payload = JSON.parse(stored) as AuthorizationPayload;
    return payload.token ?? null;
  } catch {
    return null;
  }
}

function getStoredAuthPayload(): AuthorizationPayload | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(AUTH_PAYLOAD_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthorizationPayload;
  } catch {
    return null;
  }
}

function setStoredAuthPayload(payload: AuthorizationPayload | null) {
  if (typeof window === 'undefined') return;
  if (payload) {
    window.localStorage.setItem(AUTH_PAYLOAD_KEY, JSON.stringify(payload));
  } else {
    window.localStorage.removeItem(AUTH_PAYLOAD_KEY);
  }
}

function parsePermissions(permissionsStr?: string): string[] {
  if (!permissionsStr) return [];
  return permissionsStr.split(';').filter(Boolean);
}

interface AuthorizationData {
  Authorization: AuthorizationPayload;
}

interface LogoutData {
  Logout: { ok?: boolean };
}

interface GetPermissionsData {
  GetPermissions: { permissions: string[] };
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient();
  const [authPayload, setAuthPayload] = useState<AuthorizationPayload | null>(
    getStoredAuthPayload(),
  );
  const [permissions, setPermissions] = useState<string[]>(() => {
    const stored = getStoredAuthPayload();
    return stored ? parsePermissions(stored.permissions) : [];
  });
  const [loading, setLoading] = useState<boolean>(Boolean(getStoredAuthPayload()));
  const [error, setError] = useState<string | null>(null);

  const [authorizationMutation] = useMutation<AuthorizationData>(AUTHORIZATION_QUERY);
  const [logoutMutation] = useMutation<LogoutData>(LOGOUT_MUTATION);

  // On boot, optionally refresh permissions from server
  useEffect(() => {
    let cancelled = false;
    if (!authPayload?.token) {
      setLoading(false);
      return;
    }
    // Optionally call GetPermissions to refresh permission list
    (async () => {
      try {
        const res = await client.query<GetPermissionsData>({
          query: GET_PERMISSIONS_QUERY,
          variables: { input: { accessToken: authPayload.token } },
          fetchPolicy: 'network-only',
        });
        if (!cancelled && res.data?.GetPermissions) {
          setPermissions(res.data.GetPermissions.permissions);
        }
      } catch (e) {
        // If GetPermissions fails, fall back to stored permissions
        if (!cancelled) {
          console.warn('Failed to refresh permissions:', e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [client, authPayload?.token]);

  const login = useCallback(
    async (loginName: string, password: string) => {
      setError(null);
      setLoading(true);
      try {
        const res = await authorizationMutation({
          variables: { input: { login: loginName, password } },
        });
        const payload = res.data?.Authorization;
        if (!payload) throw new Error(res.errors?.[0]?.message ?? 'Login failed');
        setStoredAuthPayload(payload);
        setAuthPayload(payload);
        setPermissions(parsePermissions(payload.permissions));
        await client.resetStore();
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Login failed';
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [client, authorizationMutation],
  );

  const logout = useCallback(async () => {
    try {
      if (authPayload?.token) {
        await logoutMutation({
          variables: { input: { accessToken: authPayload.token } },
        });
      }
    } catch {
      /* logout errors are not user-facing */
    }
    setStoredAuthPayload(null);
    setAuthPayload(null);
    setPermissions([]);
    await client.clearStore();
  }, [client, logoutMutation, authPayload]);

  const hasPermission = useCallback(
    (perm: PermissionId | string) => {
      return permissions.includes(perm);
    },
    [permissions],
  );

  const username = authPayload?.username ?? null;
  const token = authPayload?.token ?? null;

  const value = useMemo<SessionContextValue>(
    () => ({
      authPayload,
      username,
      token,
      permissions,
      loading,
      error,
      login,
      logout,
      hasPermission,
    }),
    [authPayload, username, token, permissions, loading, error, login, logout, hasPermission],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}

/** Convenience hook: throws if no user is currently logged in. */
export function useCurrentUser(): { username: string } {
  const { username } = useSession();
  if (!username) throw new Error('No authenticated user — wrap routes in <RequireAuth>');
  return { username };
}
