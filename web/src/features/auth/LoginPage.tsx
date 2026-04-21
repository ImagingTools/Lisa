import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '@/auth/SessionContext';

interface LocationState {
  from?: string;
}

export function LoginPage() {
  const { user, login, error, loading } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginName, setLoginName] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (user) {
    const dest = (location.state as LocationState | null)?.from ?? '/products';
    return <Navigate to={dest} replace />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSubmitting(true);
    try {
      await login(loginName.trim(), password);
      const dest = (location.state as LocationState | null)?.from ?? '/products';
      navigate(dest, { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card panel">
        <h1>Lisa</h1>
        <form className="form" onSubmit={onSubmit} aria-busy={submitting}>
          {(localError || error) && (
            <div className="error-banner" role="alert">
              {localError ?? error}
            </div>
          )}
          <div className="form-field">
            <label htmlFor="login">User</label>
            <input
              id="login"
              autoComplete="username"
              autoFocus
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting || loading}
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
          <div className="login-hint">
            Demo accounts: <code>admin</code>/<code>admin</code> ·{' '}
            <code>viewer</code>/<code>view</code>
          </div>
        </form>
      </div>
    </div>
  );
}
