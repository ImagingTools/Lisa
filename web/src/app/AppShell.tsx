import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSession } from '@/auth/SessionContext';
import { useTheme } from '@/app/ThemeProvider';
import type { PermissionId } from '@/types/domain';

interface NavItem {
  to: string;
  label: string;
  permission: PermissionId;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/products', label: 'Products', permission: 'ViewProducts' },
  { to: '/licenses', label: 'Licenses', permission: 'ViewLicenses' },
  { to: '/features', label: 'Features', permission: 'ViewFeatures' },
  { to: '/accounts', label: 'Accounts', permission: 'Administration' },
];

export function AppShell() {
  const { user, logout, hasPermission } = useSession();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="Primary navigation">
        <div className="app-sidebar__brand">Lisa</div>
        <nav className="app-sidebar__nav">
          {NAV_ITEMS.map((item) => {
            const allowed = hasPermission(item.permission);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  ['nav-link', isActive ? 'is-active' : '', allowed ? '' : 'is-disabled']
                    .filter(Boolean)
                    .join(' ')
                }
                aria-disabled={!allowed}
                onClick={(e) => {
                  if (!allowed) e.preventDefault();
                }}
                title={allowed ? undefined : `Requires '${item.permission}'`}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <header className="app-header">
        <div className="app-header__title">License &amp; Product Management</div>
        <div className="app-header__actions">
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={toggle}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? '☀︎' : '☾'}
          </button>
          {user && (
            <div className="app-header__user">
              <span>
                <strong>{user.displayName}</strong>{' '}
                <span style={{ color: 'var(--color-text-muted)' }}>({user.login})</span>
              </span>
              <button
                type="button"
                className="btn btn--small"
                onClick={async () => {
                  await logout();
                  navigate('/login', { replace: true });
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
