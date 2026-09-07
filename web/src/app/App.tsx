import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { useMemo } from 'react';
import { createApolloClient } from '@/api/client';
import { SessionProvider, getStoredToken } from '@/auth/SessionContext';
import { ThemeProvider } from '@/app/ThemeProvider';
import { AppErrorBoundary } from '@/components/feedback/AppErrorBoundary';
import { AppRoutes } from '@/routes/AppRoutes';

export function App() {
  // Apollo Client must be a stable, app-lifetime singleton.
  const client = useMemo(() => createApolloClient({ getToken: getStoredToken }), []);

  return (
    <AppErrorBoundary>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <BrowserRouter>
            <SessionProvider>
              <AppRoutes />
            </SessionProvider>
          </BrowserRouter>
        </ThemeProvider>
      </ApolloProvider>
    </AppErrorBoundary>
  );
}
