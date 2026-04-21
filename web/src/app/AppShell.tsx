import type { ComponentType, SVGProps } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSession } from '@/auth/SessionContext';
import { useTheme } from '@/app/ThemeProvider';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  AccountsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FeaturesIcon,
  LicensesIcon,
  LogoutIcon,
  MoonIcon,
  ProductsIcon,
  SunIcon,
} from '@/components/icons';
import type { PermissionId } from '@/types/domain';

interface NavItem {
  to: string;
  label: string;
  permission: PermissionId;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/products', label: 'Products', permission: 'ViewProducts', Icon: ProductsIcon },
  { to: '/licenses', label: 'Licenses', permission: 'ViewLicenses', Icon: LicensesIcon },
  { to: '/features', label: 'Features', permission: 'ViewFeatures', Icon: FeaturesIcon },
  { to: '/accounts', label: 'Accounts', permission: 'Administration', Icon: AccountsIcon },
];

export function AppShell() {
  const { username, logout, hasPermission } = useSession();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useLocalStorage<boolean>(
    'lisa-web.sidebar.collapsed.v1',
    false,
  );

  const shellClass = `app-shell ${collapsed ? 'is-sidebar-collapsed' : ''}`;

  return (
    <div className={shellClass}>
      <aside className="app-sidebar" aria-label="Primary navigation">
        <div className="app-sidebar__brand" title="Lisa">
          <span className="app-sidebar__brand-text">Lisa</span>
          <span className="app-sidebar__brand-mark" aria-hidden="true">L</span>
        </div>
        <nav className="app-sidebar__nav">
          {NAV_ITEMS.map(({ to, label, permission, Icon }) => {
            const allowed = hasPermission(permission);
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  ['nav-link', isActive ? 'is-active' : '', allowed ? '' : 'is-disabled']
                    .filter(Boolean)
                    .join(' ')
                }
                aria-disabled={!allowed}
                onClick={(e) => {
                  if (!allowed) e.preventDefault();
                }}
                title={
                  allowed
                    ? collapsed
                      ? label
                      : undefined
                    : `Requires '${permission}'`
                }
              >
                <Icon className="nav-link__icon" />
                <span className="nav-link__label">{label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="app-sidebar__footer">
          <button
            type="button"
            className="app-sidebar__collapse"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            <span className="nav-link__label">Collapse</span>
          </button>
        </div>
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
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          {username && (
            <div className="app-header__user">
              <span>
                <strong>{username}</strong>
              </span>
              <button
                type="button"
                className="btn btn--small"
                onClick={async () => {
                  await logout();
                  navigate('/login', { replace: true });
                }}
                title="Sign out"
              >
                <LogoutIcon />
                <span>Sign out</span>
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
