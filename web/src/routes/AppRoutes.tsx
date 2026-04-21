import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import { RequireAuth } from '@/auth/RequireAuth';
import { LoginPage } from '@/features/auth/LoginPage';
import { ProductsPage } from '@/features/products/ProductsPage';
import { LicensesPage } from '@/features/licenses/LicensesPage';
import { FeaturesPage } from '@/features/features/FeaturesPage';
import { AccountsPage } from '@/features/accounts/AccountsPage';

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
        <Route index element={<Navigate to="/products" replace />} />
        <Route
          path="/products"
          element={
            <RequireAuth permission="ViewProducts">
              <ProductsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/licenses"
          element={
            <RequireAuth permission="ViewLicenses">
              <LicensesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/features"
          element={
            <RequireAuth permission="ViewFeatures">
              <FeaturesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/accounts"
          element={
            <RequireAuth permission="Administration">
              <AccountsPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Route>
    </Routes>
  );
}
