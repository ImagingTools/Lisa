/**
 * Accounts page (administration).
 *
 * Read-only P0. The QML side ships this behind the `Administration`
 * permission as a simple list (mirroring the SQL `Accounts` table).
 *
 * Wrapped in `PageTabs` for layout parity with the other pages, even
 * though there is no editor. Double-clicking a row opens a read-only
 * detail tab.
 */
import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ACCOUNTS_LIST } from '@/api/graphql/operations';
import type { Account } from '@/types/domain';
import { CenteredSpinner } from '@/components/feedback/CenteredSpinner';
import { EmptyState } from '@/components/feedback/EmptyState';
import { DataTable, type Column } from '@/components/DataTable';
import { COLLECTION_TAB_ID, PageTabs, usePageTabs } from '@/components/PageTabs';

interface AccountsListData {
  accountsList: Account[];
}

const detailTabId = (id: string) => `account:${id}`;

export function AccountsPage() {
  const { data, loading, error, refetch } = useQuery<AccountsListData>(ACCOUNTS_LIST);
  const tabs = usePageTabs('accounts', 'Accounts');

  if (loading && !data) return <CenteredSpinner label="Loading accounts…" />;
  const accounts = data?.accountsList ?? [];

  return (
    <PageTabs
      api={tabs}
      renderTab={(tabId) => {
        if (tabId === COLLECTION_TAB_ID) {
          return (
            <AccountsCollection
              accounts={accounts}
              error={error?.message}
              onRetry={() => refetch()}
              onActivate={(a) =>
                tabs.openTab({
                  id: detailTabId(a.id),
                  title: a.name,
                  subtitle: a.id,
                })
              }
            />
          );
        }
        if (!tabId.startsWith('account:')) return null;
        const id = tabId.slice('account:'.length);
        const account = accounts.find((a) => a.id === id);
        if (!account) {
          return (
            <EmptyState
              title="Account not found"
              message="This account no longer exists. Close this tab to dismiss it."
            />
          );
        }
        return (
          <AccountDetail account={account} onClose={() => tabs.closeTab(tabId)} />
        );
      }}
    />
  );
}

function AccountsCollection({
  accounts,
  error,
  onRetry,
  onActivate,
}: {
  accounts: Account[];
  error?: string;
  onRetry: () => void;
  onActivate: (a: Account) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const columns: Column<Account>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Account',
        cell: (a) => (
          <>
            <strong>{a.name}</strong>
            <div className="panel__subtitle"><code>{a.id}</code></div>
          </>
        ),
        sortValue: (a) => a.name.toLowerCase(),
        width: 220,
      },
      {
        key: 'type',
        header: 'Type',
        cell: (a) => <span className="tag">{a.type}</span>,
        sortValue: (a) => a.type,
        width: 110,
      },
      {
        key: 'owner',
        header: 'Owner',
        cell: (a) => `${a.ownerFirstName} ${a.ownerLastName}`,
        sortValue: (a) => `${a.ownerLastName} ${a.ownerFirstName}`.toLowerCase(),
        width: 180,
      },
      {
        key: 'email',
        header: 'Email',
        cell: (a) => <a href={`mailto:${a.ownerMail}`}>{a.ownerMail}</a>,
        sortValue: (a) => a.ownerMail.toLowerCase(),
        width: 220,
      },
      {
        key: 'description',
        header: 'Description',
        cell: (a) => a.description ?? '—',
        sortValue: (a) => (a.description ?? '').toLowerCase(),
        width: 240,
      },
    ],
    [],
  );

  const selected = (selectedId && accounts.find((a) => a.id === selectedId)) || null;

  return (
    <>
      <div className="page-header">
        <h1 style={{ margin: 0 }}>Accounts</h1>
      </div>
      {error && (
        <div className="error-banner" role="alert">
          Failed to load: {error}{' '}
          <button className="btn btn--small" onClick={onRetry}>Retry</button>
        </div>
      )}
      {accounts.length === 0 ? (
        <EmptyState title="No accounts" message="No accounts have been provisioned." />
      ) : (
        <div className="collection-layout">
          <div className="panel" style={{ padding: 0 }}>
            <DataTable<Account>
              tableId="accounts"
              ariaLabel="Accounts list"
              columns={columns}
              rows={accounts}
              rowKey={(a) => a.id}
              selectedKey={selectedId}
              onSelect={(a) => setSelectedId(a.id)}
              onActivate={onActivate}
              emptyMessage="No accounts."
            />
            <div className="collection-layout__hint">
              Double-click a row (or press Enter) to open the account in a new tab.
            </div>
          </div>
          <div className="panel">
            <h3 className="panel__title" style={{ marginBottom: 'var(--margin-m)' }}>
              Details
            </h3>
            {selected ? (
              <dl className="meta-grid">
                <dt>Account</dt>
                <dd><strong>{selected.name}</strong></dd>
                <dt>Id</dt>
                <dd><code>{selected.id}</code></dd>
                <dt>Type</dt>
                <dd>{selected.type}</dd>
                <dt>Owner</dt>
                <dd>{selected.ownerFirstName} {selected.ownerLastName}</dd>
                <dt>Email</dt>
                <dd><a href={`mailto:${selected.ownerMail}`}>{selected.ownerMail}</a></dd>
                <dt>Description</dt>
                <dd>{selected.description ?? '—'}</dd>
              </dl>
            ) : (
              <p className="panel__subtitle">Select a row to see its details.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function AccountDetail({ account, onClose }: { account: Account; onClose: () => void }) {
  return (
    <div className="form">
      <div className="panel__header">
        <div>
          <h2 className="panel__title">{account.name}</h2>
          <div className="panel__subtitle">
            <code>{account.id}</code> · <span className="tag">{account.type}</span>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
      <dl className="meta-grid">
        <dt>Owner</dt>
        <dd>{account.ownerFirstName} {account.ownerLastName}</dd>
        <dt>Email</dt>
        <dd><a href={`mailto:${account.ownerMail}`}>{account.ownerMail}</a></dd>
        <dt>Description</dt>
        <dd>{account.description ?? '—'}</dd>
      </dl>
    </div>
  );
}
