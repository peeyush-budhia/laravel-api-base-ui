import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';

import { permissions } from '../../auth/permissions';
import { useAuthorization } from '../../auth/useAuthorization';
import { usersApi } from '../../api/users';
import type { PaginationMeta } from '../../types/pagination';
import { type User, type UserTrashedFilter } from '../../types/user';
import { routes } from '../../routes/routes';
import { getApiErrorMessage } from '../../utils/apiErrorUtils';

import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import PageMeta from '../../components/common/PageMeta';
import Pagination from '../../components/common/Pagination';
import UserActionConfirmationModal from '../../components/users/UserActionConfirmationModal';
import UserFilters from '../../components/users/UserFilters';
import UserTable from '../../components/users/UserTable';

export default function Users() {
  const { can } = useAuthorization();

  const canViewUsers = can(permissions.users.view);
  const canCreateUsers = can(permissions.users.create);
  const canUpdateUsers = can(permissions.users.update);
  const canDeleteUsers = can(permissions.users.delete);

  const [users, setUsers] = useState<User[]>([]);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [sort, setSort] = useState('first_name');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');

  const [trashed, setTrashed] = useState<UserTrashedFilter>('without');

  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [restoreUser, setRestoreUser] = useState<User | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState('');

  const [forceDeleteUser, setForceDeleteUser] = useState<User | null>(null);
  const [isForceDeleting, setIsForceDeleting] = useState(false);
  const [forceDeleteError, setForceDeleteError] = useState('');

  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: perPage,
    total: 0,
    last_page: 1,
    from: null,
    to: null,
    path: '',
    links: {
      first: null,
      last: null,
      prev: null,
      next: null,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await usersApi.list({
        page,
        perPage,
        search,
        sort,
        direction,
        trashed,
      });

      setUsers(response.data);
      setMeta(response.meta);
    } catch (error: unknown) {
      setUsers([]);

      setError(
        getApiErrorMessage(error, 'Unable to load users. Please try again.'),
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, search, sort, direction, trashed]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadUsers]);

  function handlePerPageChange(value: number) {
    setPerPage(value);
    setPage(1);
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleClearSearch() {
    setSearchInput('');
    setSearch('');
    setPage(1);
  }

  function handleTrashedChange(value: UserTrashedFilter) {
    setTrashed(value);
    setPage(1);
  }

  function handleSort(field: string) {
    setPage(1);

    if (sort === field) {
      setDirection((current) => (current === 'asc' ? 'desc' : 'asc'));

      return;
    }

    setSort(field);
    setDirection('asc');
  }

  /*
   * Delete
   */

  function openDeleteConfirmation(user: User) {
    setDeleteError('');
    setDeleteUser(user);
  }

  function closeDeleteConfirmation() {
    if (isDeleting) {
      return;
    }

    setDeleteUser(null);
    setDeleteError('');
  }

  async function handleDeleteUser() {
    if (!deleteUser || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      await usersApi.delete(deleteUser.id);

      setDeleteUser(null);

      await loadUsers();
    } catch (error: unknown) {
      setDeleteError(
        getApiErrorMessage(error, 'Unable to delete user. Please try again.'),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  /*
   * Restore
   */

  function openRestoreConfirmation(user: User) {
    setRestoreError('');
    setRestoreUser(user);
  }

  function closeRestoreConfirmation() {
    if (isRestoring) {
      return;
    }

    setRestoreUser(null);
    setRestoreError('');
  }

  async function handleRestoreUser() {
    if (!restoreUser || isRestoring) {
      return;
    }

    setIsRestoring(true);
    setRestoreError('');

    try {
      await usersApi.restore(restoreUser.id);

      setRestoreUser(null);

      await loadUsers();
    } catch (error: unknown) {
      setRestoreError(
        getApiErrorMessage(error, 'Unable to restore user. Please try again.'),
      );
    } finally {
      setIsRestoring(false);
    }
  }

  /*
   * Force delete
   */

  function openForceDeleteConfirmation(user: User) {
    setForceDeleteError('');
    setForceDeleteUser(user);
  }

  function closeForceDeleteConfirmation() {
    if (isForceDeleting) {
      return;
    }

    setForceDeleteUser(null);
    setForceDeleteError('');
  }

  async function handleForceDeleteUser() {
    if (!forceDeleteUser || isForceDeleting) {
      return;
    }

    setIsForceDeleting(true);
    setForceDeleteError('');

    try {
      await usersApi.forceDelete(forceDeleteUser.id);

      setForceDeleteUser(null);

      await loadUsers();
    } catch (error: unknown) {
      setForceDeleteError(
        getApiErrorMessage(
          error,
          'Unable to permanently delete user. Please try again.',
        ),
      );
    } finally {
      setIsForceDeleting(false);
    }
  }

  if (!canViewUsers) {
    return (
      <>
        <PageMeta title="Users" description="Manage application users" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You do not have permission to view users.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Users" description="Manage application users" />

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Users
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage application users.
            </p>
          </div>

          {canCreateUsers && (
            <Link
              to={routes.users.create}
              className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
            >
              Add User
            </Link>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 p-5 dark:border-gray-800">
            <UserFilters
              searchInput={searchInput}
              search={search}
              trashed={trashed}
              onSearchInputChange={setSearchInput}
              onSearchSubmit={handleSearchSubmit}
              onClearSearch={handleClearSearch}
              onTrashedChange={handleTrashedChange}
              perPage={perPage}
              onPerPageChange={handlePerPageChange}
            />
          </div>

          {error ? (
            <ErrorState
              title="Unable to load users"
              message={error}
              onRetry={() => {
                void loadUsers();
              }}
            />
          ) : !isLoading && users.length === 0 ? (
            <EmptyState
              title="No users found"
              message="There are no user entries matching your current filters."
            />
          ) : (
            <>
              <UserTable
                users={users}
                isLoading={isLoading}
                sort={sort}
                direction={direction}
                trashed={trashed}
                canView={canViewUsers}
                canUpdate={canUpdateUsers}
                canDelete={canDeleteUsers}
                onSort={handleSort}
                onDelete={openDeleteConfirmation}
                onRestore={openRestoreConfirmation}
                onForceDelete={openForceDeleteConfirmation}
              />

              {!isLoading && (
                <Pagination
                  meta={meta}
                  page={page}
                  onPageChange={setPage}
                  resourceLabel="users"
                />
              )}
            </>
          )}
        </div>
      </div>

      <UserActionConfirmationModal
        user={deleteUser}
        action="delete"
        isSubmitting={isDeleting}
        error={deleteError}
        onClose={closeDeleteConfirmation}
        onConfirm={() => {
          void handleDeleteUser();
        }}
      />

      <UserActionConfirmationModal
        user={forceDeleteUser}
        action="force-delete"
        isSubmitting={isForceDeleting}
        error={forceDeleteError}
        onClose={closeForceDeleteConfirmation}
        onConfirm={() => {
          void handleForceDeleteUser();
        }}
      />

      <UserActionConfirmationModal
        user={restoreUser}
        action="restore"
        isSubmitting={isRestoring}
        error={restoreError}
        onClose={closeRestoreConfirmation}
        onConfirm={() => {
          void handleRestoreUser();
        }}
      />
    </>
  );
}
