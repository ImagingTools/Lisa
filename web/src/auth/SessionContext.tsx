/**
 * Auth context and `useSession` hook.
 *
 * Conceptually mirrors the QML `AuthorizationController` and
 * `PermissionsController`. The session is held in React state and persisted
 * to `localStorage` so a refresh keeps the user logged in (matching the
 * QML "remember login" behaviour that the desktop client provides via Qt
 * settings).
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
import { LOGIN_MUTATION, LOGOUT_MUTATION, ME_QUERY } from '@/api/graphql/operations';
import type { PermissionId, SessionUser } from '@/types/domain';

const TOKEN_KEY = 'lisa-web.token';

interface SessionContextValue {
  user: SessionUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (perm: PermissionId | string) => boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

interface LoginData {
  login: { token: string; user: SessionUser };
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState<boolean>(Boolean(getStoredToken()));
  const [error, setError] = useState<string | null>(null);

  const [loginMutation] = useMutation<LoginData>(LOGIN_MUTATION);
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  // On boot, try to recover the session.
  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await client.query<{ me: SessionUser | null }>({
          query: ME_QUERY,
          fetchPolicy: 'network-only',
        });
        if (!cancelled) setUser(res.data?.me ?? null);
      } catch (e) {
        if (!cancelled) {
          setUser(null);
          setStoredToken(null);
          setToken(null);
          setError(e instanceof Error ? e.message : 'Failed to restore session');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [client, token]);

  const login = useCallback(
    async (loginName: string, password: string) => {
      setError(null);
      setLoading(true);
      try {
        const res = await loginMutation({ variables: { login: loginName, password } });
        const payload = res.data?.login;
        if (!payload) throw new Error(res.errors?.[0]?.message ?? 'Login failed');
        setStoredToken(payload.token);
        setToken(payload.token);
        setUser(payload.user);
        await client.resetStore();
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Login failed';
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [client, loginMutation],
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation();
    } catch {
      /* logout errors are not user-facing */
    }
    setStoredToken(null);
    setToken(null);
    setUser(null);
    await client.clearStore();
  }, [client, logoutMutation]);

  const hasPermission = useCallback(
    (perm: PermissionId | string) => {
      if (!user) return false;
      return user.permissions.includes(perm);
    },
    [user],
  );

  const value = useMemo<SessionContextValue>(
    () => ({ user, token, loading, error, login, logout, hasPermission }),
    [user, token, loading, error, login, logout, hasPermission],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}

/** Convenience hook: throws if no user is currently logged in. */
export function useCurrentUser(): SessionUser {
  const { user } = useSession();
  if (!user) throw new Error('No authenticated user — wrap routes in <RequireAuth>');
  return user;
}
