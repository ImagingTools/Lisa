import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from './SessionContext';
import type { PermissionId } from '@/types/domain';
import { CenteredSpinner } from '@/components/feedback/CenteredSpinner';

/**
 * Route guard. Mirrors the QML pattern where `ApplicationMain` switches to a
 * login page until `AuthorizationController.loggedIn` becomes true.
 *
 * Note: permission checks are enforced on the server, so the `permission`
 * prop is accepted for API compatibility but not evaluated on the client.
 * Unauthorised actions surface as GraphQL errors from the server.
 */
export function RequireAuth({
  children,
  permission: _permission,
}: {
  children: ReactNode;
  /** Accepted for API compatibility; not enforced on the client. */
  permission?: PermissionId | string;
}) {
  void _permission;
  const { username, loading } = useSession();
  const location = useLocation();

  if (loading) return <CenteredSpinner label="Restoring session…" />;

  if (!username) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
