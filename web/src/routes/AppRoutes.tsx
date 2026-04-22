import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import { RequireAuth } from '@/auth/RequireAuth';
import { LoginPage } from '@/features/auth/LoginPage';
import { PageHost } from '@/app/PageHost';

/**
 * Top-level routes. The application's primary navigation is driven by the
 * `PagesData` GraphQL query (see `AppShell` + `PageHost`); we expose a
 * generic `/:pageId` route that resolves to the right shell + content via
 * the page registry, and keep the legacy single-purpose paths as redirects
 * so existing bookmarks keep working.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/Products" replace />} />
        <Route path="/:pageId" element={<PageHost />} />
        <Route path="*" element={<Navigate to="/Products" replace />} />
      </Route>
    </Routes>
  );
}
