import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useSession } from '@/auth/SessionContext';
import { useTheme } from '@/app/ThemeProvider';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LogoutIcon,
  MoonIcon,
  SunIcon,
} from '@/components/icons';
import { PAGES_DATA_QUERY } from '@/api/graphql/operations';
import type { PageDataItem, PagesDataPayload } from '@/types/domain';
import { resolvePageIcon } from '@/app/pageRegistry';

interface PagesDataResult {
  PagesData: PagesDataPayload;
}

function sortPages(items: readonly PageDataItem[]): PageDataItem[] {
  return [...items]
    .filter((p) => p.visible !== false)
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}

export function AppShell() {
  const { username, logout } = useSession();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useLocalStorage<boolean>(
    'lisa-web.sidebar.collapsed.v1',
    false,
  );

  const { data } = useQuery<PagesDataResult>(PAGES_DATA_QUERY, {
    fetchPolicy: 'cache-first',
  });
  const pages = sortPages(data?.PagesData?.items ?? []);

  const shellClass = `app-shell ${collapsed ? 'is-sidebar-collapsed' : ''}`;

  return (
    <div className={shellClass}>
      <aside className="app-sidebar" aria-label="Primary navigation">
        <div className="app-sidebar__brand" title="Lisa">
          <span className="app-sidebar__brand-text">Lisa</span>
          <span className="app-sidebar__brand-mark" aria-hidden="true">L</span>
        </div>
        <nav className="app-sidebar__nav">
          {pages.map((page) => {
            const Icon = resolvePageIcon(page.icon);
            const enabled = page.isEnabled !== false;
            const label = page.name ?? page.id;
            return (
              <NavLink
                key={page.id}
                to={`/${page.id}`}
                className={({ isActive }) =>
                  ['nav-link', isActive ? 'is-active' : '', enabled ? '' : 'is-disabled']
                    .filter(Boolean)
                    .join(' ')
                }
                aria-disabled={!enabled}
                onClick={(e) => {
                  if (!enabled) e.preventDefault();
                }}
                title={collapsed ? label : undefined}
              >
                {Icon ? <Icon className="nav-link__icon" /> : <span className="nav-link__icon" />}
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
