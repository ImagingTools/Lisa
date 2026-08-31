/**
 * Accounts page (administration).
 *
 * Accounts are users in the SDL. This page uses the UsersList query and
 * the UserAdd / UserUpdate mutations, gated behind the `Administration`
 * permission.
 *
 * Layout mirrors other feature pages: a collection tab with a DataTable,
 * and editor tabs opened on row activation or via "+ New user".
 */
import { useMemo, useState, type FormEvent } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  USERS_LIST,
  USER_ADD,
  USER_UPDATE,
} from '@/api/graphql/operations';
import type { UserItemData, UserData } from '@/types/domain';
import { useSession } from '@/auth/SessionContext';
import { CenteredSpinner } from '@/components/feedback/CenteredSpinner';
import { EmptyState } from '@/components/feedback/EmptyState';
import { type Column } from '@/components/DataTable';
import { CollectionLayout } from '@/components/CollectionLayout';
import { COLLECTION_TAB_ID, PageTabs, usePageTabs } from '@/components/PageTabs';

interface UsersListData {
  UsersList: {
    items: UserItemData[];
  };
}

const NEW_TAB_ID = 'new:user';
const editorTabId = (id: string) => `editor:${id}`;

function splitDelim(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
}

export function AccountsPage() {
  const { hasPermission } = useSession();
  const { data, loading, error, refetch } = useQuery<UsersListData>(USERS_LIST, {
    variables: { input: {} },
  });
  const tabs = usePageTabs('accounts', 'Accounts');

  if (loading && !data) return <CenteredSpinner label="Loading accounts…" />;

  const users = data?.UsersList?.items ?? [];
  const canAdminister = hasPermission('Administration');

  const findUser = (id: string) => users.find((u) => u.id === id) ?? null;

  return (
    <PageTabs
      api={tabs}
      renderTab={(tabId) => {
        if (tabId === COLLECTION_TAB_ID) {
          return (
            <AccountsCollection
              users={users}
              error={error?.message}
              onRetry={() => refetch()}
              canCreate={canAdminister}
              onActivate={(u) =>
                tabs.openTab({
                  id: editorTabId(u.id),
                  title: u.name ?? u.id,
                  subtitle: u.id,
                })
              }
              onCreate={() =>
                tabs.openTab({ id: NEW_TAB_ID, title: 'New user' })
              }
            />
          );
        }
        if (tabId === NEW_TAB_ID) {
          return (
            <UserEditor
              mode="create"
              canSave={canAdminister}
              onClose={() => tabs.closeTab(NEW_TAB_ID)}
              onSaved={(saved) =>
                tabs.replaceTab(NEW_TAB_ID, {
                  id: editorTabId(saved.id),
                  title: saved.name,
                  subtitle: saved.id,
                  closable: true,
                })
              }
            />
          );
        }
        if (!tabId.startsWith('editor:')) return null;
        const id = tabId.slice('editor:'.length);
        const user = findUser(id);
        if (!user) {
          return (
            <EmptyState
              title="User not found"
              message="This user no longer exists. Close this tab to dismiss it."
            />
          );
        }
        return (
          <UserEditor
            user={user}
            mode="edit"
            canSave={canAdminister}
            onClose={() => tabs.closeTab(tabId)}
            onSaved={(saved) =>
              tabs.renameTab(tabId, { title: saved.name, subtitle: saved.id })
            }
          />
        );
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Collection
// ---------------------------------------------------------------------------

function AccountsCollection({
  users,
  error,
  onRetry,
  canCreate,
  onActivate,
  onCreate,
}: {
  users: UserItemData[];
  error?: string;
  onRetry: () => void;
  canCreate: boolean;
  onActivate: (u: UserItemData) => void;
  onCreate: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const columns: Column<UserItemData>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'User',
        cell: (u) => (
          <>
            <strong>{u.name ?? u.id}</strong>
            <div className="panel__subtitle"><code>{u.id}</code></div>
          </>
        ),
        sortValue: (u) => (u.name ?? u.id).toLowerCase(),
        width: 220,
      },
      {
        key: 'mail',
        header: 'Email',
        cell: (u) => (u.mail ? <a href={`mailto:${u.mail}`}>{u.mail}</a> : '—'),
        sortValue: (u) => (u.mail ?? '').toLowerCase(),
        width: 220,
      },
      {
        key: 'roles',
        header: 'Roles',
        cell: (u) => splitDelim(u.roles).join(', ') || '—',
        sortValue: (u) => (u.roles ?? '').toLowerCase(),
        width: 200,
      },
      {
        key: 'groups',
        header: 'Groups',
        cell: (u) => splitDelim(u.groups).join(', ') || '—',
        sortValue: (u) => (u.groups ?? '').toLowerCase(),
        width: 200,
      },
      {
        key: 'description',
        header: 'Description',
        cell: (u) => u.description ?? '—',
        sortValue: (u) => (u.description ?? '').toLowerCase(),
        width: 240,
      },
    ],
    [],
  );

  return (
    <>
      {users.length === 0 && !error ? (
        <>
          <div className="page-header">
            <h1 style={{ margin: 0 }}>Accounts</h1>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn--primary"
                disabled={!canCreate}
                onClick={onCreate}
                title={canCreate ? undefined : 'Requires Administration'}
              >
                + New user
              </button>
            </div>
          </div>
          <EmptyState title="No accounts" message="No user accounts have been provisioned." />
        </>
      ) : (
        <CollectionLayout<UserItemData>
          tableId="accounts"
          ariaLabel="Accounts list"
          columns={columns}
          rows={users}
          rowKey={(u) => u.id}
          selectedKey={selectedId}
          onSelect={(u) => setSelectedId(u.id)}
          onActivate={onActivate}
          emptyMessage="No accounts."
          error={error}
          onRetry={onRetry}
          detailsTitle="Details"
          hint="Double-click a row (or press Enter) to open the user in a new tab."
          toolbar={
            <>
              <h1 style={{ margin: 0 }}>Accounts</h1>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  disabled={!canCreate}
                  onClick={onCreate}
                  title={canCreate ? undefined : 'Requires Administration'}
                >
                  + New user
                </button>
              </div>
            </>
          }
          renderDetails={(selected) =>
            selected ? (
              <dl className="meta-grid">
                <dt>User</dt>
                <dd><strong>{selected.name ?? selected.id}</strong></dd>
                <dt>Id</dt>
                <dd><code>{selected.id}</code></dd>
                <dt>Email</dt>
                <dd>
                  {selected.mail ? (
                    <a href={`mailto:${selected.mail}`}>{selected.mail}</a>
                  ) : (
                    '—'
                  )}
                </dd>
                <dt>Roles</dt>
                <dd>{splitDelim(selected.roles).join(', ') || '—'}</dd>
                <dt>Groups</dt>
                <dd>{splitDelim(selected.groups).join(', ') || '—'}</dd>
                <dt>Description</dt>
                <dd>{selected.description ?? '—'}</dd>
              </dl>
            ) : (
              <p className="panel__subtitle">Select a row to see its details.</p>
            )
          }
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

interface EditorFormState {
  id: string;
  name: string;
  username: string;
  email: string;
  rolesText: string;
  groupsText: string;
}

function UserEditor({
  user,
  mode,
  canSave,
  onClose,
  onSaved,
}: {
  user?: UserItemData;
  mode: 'create' | 'edit';
  canSave: boolean;
  onClose: () => void;
  onSaved: (saved: { id: string; name: string }) => void;
}) {
  const [form, setForm] = useState<EditorFormState>(() => ({
    id: user?.id ?? '',
    name: user?.name ?? '',
    username: user?.userId ?? '',
    email: user?.mail ?? '',
    rolesText: splitDelim(user?.roles).join(', '),
    groupsText: splitDelim(user?.groups).join(', '),
  }));
  const [validation, setValidation] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [addUser, addState] = useMutation<{ UserAdd: { id: string } }>(USER_ADD, {
    refetchQueries: [{ query: USERS_LIST, variables: { input: {} } }],
    awaitRefetchQueries: true,
  });
  const [updateUser, updateState] = useMutation<{ UserUpdate: { id: string } }>(
    USER_UPDATE,
    {
      refetchQueries: [{ query: USERS_LIST, variables: { input: {} } }],
      awaitRefetchQueries: true,
    },
  );

  const submitting = addState.loading || updateState.loading;

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (mode === 'create' && !form.id.trim()) errors.id = 'Id is required';
    setValidation(errors);
    return Object.keys(errors).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    const id = mode === 'edit' ? form.id : form.id.trim();
    const roles = splitDelim(form.rolesText);
    const groups = splitDelim(form.groupsText);
    const item: UserData = {
      id,
      name: form.name.trim(),
      username: form.username.trim() || undefined,
      email: form.email.trim() || undefined,
      roles,
      groups,
    };
    const input = { id, item };
    try {
      if (mode === 'create') {
        const res = await addUser({ variables: { input } });
        const newId = res.data?.UserAdd?.id ?? id;
        setForm((f) => ({ ...f, id: newId }));
        onSaved({ id: newId, name: item.name ?? newId });
      } else {
        const res = await updateUser({ variables: { input } });
        const updatedId = res.data?.UserUpdate?.id ?? id;
        onSaved({ id: updatedId, name: item.name ?? updatedId });
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  const disabled = !canSave;

  return (
    <form className="form" onSubmit={onSubmit} aria-busy={submitting}>
      <div className="panel__header">
        <div>
          <h2 className="panel__title">
            {mode === 'create' ? 'New user' : form.name || 'Edit user'}
          </h2>
          {mode === 'edit' && (
            <div className="panel__subtitle">
              <code>{form.id}</code>
            </div>
          )}
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose} disabled={submitting}>
            Close
          </button>
          {canSave && (
            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting || disabled}
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
          )}
        </div>
      </div>

      {!canSave && (
        <div className="panel__subtitle">
          Read-only: the <code>Administration</code> permission is required to edit users.
        </div>
      )}
      {serverError && <div className="error-banner">{serverError}</div>}

      <div className="form-row">
        <div className="form-field" style={{ flex: 1 }}>
          <label htmlFor="user-id">User id</label>
          <input
            id="user-id"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            disabled={disabled || mode === 'edit'}
            placeholder="Unique user id"
          />
          {validation.id && <span className="error-text">{validation.id}</span>}
        </div>
        <div className="form-field" style={{ flex: 2 }}>
          <label htmlFor="user-name">Name</label>
          <input
            id="user-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={disabled}
            placeholder="Display name"
          />
          {validation.name && <span className="error-text">{validation.name}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field" style={{ flex: 1 }}>
          <label htmlFor="user-username">Username</label>
          <input
            id="user-username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            disabled={disabled}
          />
        </div>
        <div className="form-field" style={{ flex: 1 }}>
          <label htmlFor="user-email">Email</label>
          <input
            id="user-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="user-roles">Roles</label>
        <input
          id="user-roles"
          value={form.rolesText}
          onChange={(e) => setForm({ ...form, rolesText: e.target.value })}
          disabled={disabled}
          placeholder="Comma-separated, e.g. Admin, Operator"
        />
      </div>

      <div className="form-field">
        <label htmlFor="user-groups">Groups</label>
        <input
          id="user-groups"
          value={form.groupsText}
          onChange={(e) => setForm({ ...form, groupsText: e.target.value })}
          disabled={disabled}
          placeholder="Comma-separated, e.g. Staff, Support"
        />
      </div>
    </form>
  );
}
