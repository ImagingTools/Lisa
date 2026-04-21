import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from './SessionContext';
import type { PermissionId } from '@/types/domain';
import { CenteredSpinner } from '@/components/feedback/CenteredSpinner';

/**
 * Route guard. Mirrors the QML pattern where `ApplicationMain` switches to a
 * login page until `AuthorizationController.loggedIn` becomes true.
 */
export function RequireAuth({
  children,
  permission,
}: {
  children: ReactNode;
  /** Optional permission gate — `PermissionsController.checkPermission(...)` */
  permission?: PermissionId | string;
}) {
  const { username, loading, hasPermission } = useSession();
  const location = useLocation();

  if (loading) return <CenteredSpinner label="Restoring session…" />;

  if (!username) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (permission && !hasPermission(permission)) {
    return <Forbidden permission={permission} />;
  }

  return <>{children}</>;
}

function Forbidden({ permission }: { permission: string }) {
  return (
    <div role="alert" className="empty-state">
      <h2>Access denied</h2>
      <p>
        Your account does not have the <code>{permission}</code> permission required to
        view this page.
      </p>
    </div>
  );
}
