/**
 * Accounts page (administration).
 *
 * Read-only P0. The QML side ships this behind the `Administration`
 * permission as a simple list (mirroring the SQL `Accounts` table).
 */
import { useQuery } from '@apollo/client';
import { ACCOUNTS_LIST } from '@/api/graphql/operations';
import type { Account } from '@/types/domain';
import { CenteredSpinner } from '@/components/feedback/CenteredSpinner';
import { EmptyState } from '@/components/feedback/EmptyState';

interface AccountsListData {
  accountsList: Account[];
}

export function AccountsPage() {
  const { data, loading, error, refetch } = useQuery<AccountsListData>(ACCOUNTS_LIST);

  if (loading && !data) return <CenteredSpinner label="Loading accounts…" />;
  return (
    <>
      <div className="page-header">
        <h1>Accounts</h1>
      </div>
      {error && (
        <div className="error-banner" role="alert">
          Failed to load: {error.message}{' '}
          <button className="btn btn--small" onClick={() => refetch()}>Retry</button>
        </div>
      )}
      {data?.accountsList?.length === 0 ? (
        <EmptyState title="No accounts" message="No accounts have been provisioned." />
      ) : (
        <div className="panel" style={{ padding: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Type</th>
                <th>Owner</th>
                <th>Email</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {data?.accountsList.map((a) => (
                <tr key={a.id}>
                  <td>
                    <strong>{a.name}</strong>
                    <div className="panel__subtitle"><code>{a.id}</code></div>
                  </td>
                  <td>
                    <span className="tag">{a.type}</span>
                  </td>
                  <td>
                    {a.ownerFirstName} {a.ownerLastName}
                  </td>
                  <td>
                    <a href={`mailto:${a.ownerMail}`}>{a.ownerMail}</a>
                  </td>
                  <td>{a.description ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
