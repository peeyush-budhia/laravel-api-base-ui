import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';

import { usersApi } from '../../api/users';

import {
  userStatusColors,
  userStatusLabels,
  type User,
  type UserTrashedFilter,
} from '../../types/user';

import { useAuth } from '../../auth/useAuth';
import { permissions } from '../../auth/permissions';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

import Badge from '../../components/ui/badge/Badge';
import PageMeta from '../../components/common/PageMeta';

import { Dropdown } from '../../components/ui/dropdown/Dropdown';
import { DropdownItem } from '../../components/ui/dropdown/DropdownItem';

import { Modal } from '../../components/ui/modal';

import { routes } from '../../routes/routes';
import { MoreDotIcon } from '../../icons';

const PER_PAGE = 15;

function formatDate(value: string | null): string {
  if (!value) {
    return 'Never';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function UserAvatar({ user }: { user: User }) {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.full_name}
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
      {user.full_name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [sort, setSort] = useState('first_name');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');

  const [trashed, setTrashed] = useState<UserTrashedFilter>('without');

  const [openActionUserId, setOpenActionUserId] = useState<string | null>(null);

  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [restoreUser, setRestoreUser] = useState<User | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState('');

  const [forceDeleteUser, setForceDeleteUser] = useState<User | null>(null);
  const [isForceDeleting, setIsForceDeleting] = useState(false);
  const [forceDeleteError, setForceDeleteError] = useState('');

  const { can } = useAuth();

  const canViewUsers = can(permissions.usersView);
  const canCreateUsers = can(permissions.usersCreate);
  const canUpdateUsers = can(permissions.usersUpdate);
  const canDeleteUsers = can(permissions.usersDelete);

  const [meta, setMeta] = useState({
    current_page: 1,
    per_page: PER_PAGE,
    total: 0,
    last_page: 1,
    from: null as number | null,
    to: null as number | null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await usersApi.list({
        page,
        perPage: PER_PAGE,
        search,
        sort,
        direction,
        trashed,
      });

      setUsers(response.data);

      setMeta({
        current_page: response.meta.current_page,
        per_page: response.meta.per_page,
        total: response.meta.total,
        last_page: response.meta.last_page,
        from: response.meta.from,
        to: response.meta.to,
      });
    } catch {
      setUsers([]);
      setError('Unable to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, sort, direction, trashed]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadUsers]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
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

  function handleTrashedChange(value: UserTrashedFilter) {
    setTrashed(value);
    setPage(1);
    setOpenActionUserId(null);
  }

  function toggleActions(userId: string) {
    setOpenActionUserId((current) => (current === userId ? null : userId));
  }

  function closeActions() {
    setOpenActionUserId(null);
  }

  /*
   * Delete
   */
  function openDeleteConfirmation(user: User) {
    setDeleteError('');
    setDeleteUser(user);
    closeActions();
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
      setOpenActionUserId(null);

      await loadUsers();
    } catch (error: unknown) {
      const response = (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      ).response;

      setDeleteError(
        response?.data?.message ?? 'Unable to delete user. Please try again.',
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
    closeActions();
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
      setOpenActionUserId(null);

      await loadUsers();
    } catch (error: unknown) {
      const response = (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      ).response;

      setRestoreError(
        response?.data?.message ?? 'Unable to restore user. Please try again.',
      );
    } finally {
      setIsRestoring(false);
    }
  }

  /**
   * Force delete user
   */

  function openForceDeleteConfirmation(user: User) {
    setForceDeleteError('');
    setForceDeleteUser(user);
    closeActions();
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
      setOpenActionUserId(null);

      await loadUsers();
    } catch (error: unknown) {
      const response = (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      ).response;

      setForceDeleteError(
        response?.data?.message ??
          'Unable to permanently delete user. Please try again.',
      );
    } finally {
      setIsForceDeleting(false);
    }
  }
  // End force delete user

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
          {/* Search / Filters */}
          <div className="border-b border-gray-200 p-5 dark:border-gray-800">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search users..."
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs outline-hidden transition focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800"
                />
              </div>

              <button
                type="submit"
                className="h-11 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
              >
                Search
              </button>

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setSearch('');
                    setPage(1);
                  }}
                  className="h-11 rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                >
                  Clear
                </button>
              )}

              <select
                value={trashed}
                onChange={(event) =>
                  handleTrashedChange(event.target.value as UserTrashedFilter)
                }
                className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs outline-hidden transition focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                aria-label="User filter"
              >
                <option value="without">Active Users</option>
                <option value="with">All Users</option>
                <option value="only">Deleted Users</option>
              </select>
            </form>
          </div>

          {/* General Error */}
          {error && (
            <div className="p-5">
              <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
                {error}
              </div>

              <button
                type="button"
                onClick={() => void loadUsers()}
                className="mt-3 text-sm font-medium text-brand-500 hover:text-brand-600"
              >
                Try again
              </button>
            </div>
          )}

          {!error && (
            <>
              {/* Users Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="min-w-[280px] px-5 py-4 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                      >
                        <button
                          type="button"
                          onClick={() => handleSort('first_name')}
                          className="inline-flex items-center gap-1"
                        >
                          User
                          {sort === 'first_name' && (
                            <span>{direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </button>
                      </TableCell>

                      <TableCell
                        isHeader
                        className="px-5 py-4 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                      >
                        Role
                      </TableCell>

                      <TableCell
                        isHeader
                        className="px-5 py-4 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                      >
                        Status
                      </TableCell>

                      <TableCell
                        isHeader
                        className="px-5 py-4 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                      >
                        Email Verified
                      </TableCell>

                      <TableCell
                        isHeader
                        className="px-5 py-4 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                      >
                        {trashed === 'only' ? 'Deleted At' : 'Last Login'}
                      </TableCell>

                      <TableCell
                        isHeader
                        className="px-5 py-4 text-end text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {/* Loading */}
                    {isLoading &&
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          {Array.from({ length: 6 }).map((__, cellIndex) => (
                            <TableCell key={cellIndex} className="px-5 py-4">
                              <div className="h-5 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}

                    {/* Users */}
                    {!isLoading &&
                      users.map((user) => (
                        <TableRow key={user.id}>
                          {/* User */}
                          <TableCell className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <UserAvatar user={user} />

                              <div className="min-w-0">
                                <Link
                                  to={routes.users.show(user.id)}
                                  className="truncate text-sm font-medium text-gray-800 hover:text-brand-500 dark:text-white/90 dark:hover:text-brand-400"
                                >
                                  {user.full_name}
                                </Link>

                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          {/* Role */}
                          <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {user.role ?? '—'}
                          </TableCell>

                          {/* Status */}
                          <TableCell className="px-5 py-4">
                            {user.deleted_at ? (
                              <Badge size="sm" color="error">
                                Deleted
                              </Badge>
                            ) : (
                              <Badge
                                size="sm"
                                color={userStatusColors[user.status]}
                              >
                                {userStatusLabels[user.status]}
                              </Badge>
                            )}
                          </TableCell>

                          {/* Email Verification */}
                          <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {user.email_verified_at
                              ? 'Verified'
                              : 'Not verified'}
                          </TableCell>

                          {/* Last Login / Deleted At */}
                          <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {trashed === 'only'
                              ? formatDate(user.deleted_at)
                              : user.deleted_at
                                ? formatDate(user.deleted_at)
                                : formatDate(user.last_login_at)}
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="px-5 py-4 text-end">
                            <div className="relative inline-block">
                              <button
                                type="button"
                                onClick={() => toggleActions(user.id)}
                                className="dropdown-toggle inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                aria-label={`Actions for ${user.full_name}`}
                                aria-expanded={openActionUserId === user.id}
                                aria-haspopup="menu"
                              >
                                <MoreDotIcon />
                              </button>

                              <Dropdown
                                isOpen={openActionUserId === user.id}
                                onClose={closeActions}
                                className="w-36 p-1"
                              >
                                <ul className="flex flex-col gap-1">
                                  {/* View */}
                                  <li>
                                    <DropdownItem
                                      tag="a"
                                      to={routes.users.show(user.id)}
                                      onItemClick={closeActions}
                                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                    >
                                      View
                                    </DropdownItem>
                                  </li>

                                  {/* Edit */}
                                  {canUpdateUsers && !user.deleted_at && (
                                    <li>
                                      <DropdownItem
                                        tag="a"
                                        to={routes.users.edit(user.id)}
                                        onItemClick={closeActions}
                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                      >
                                        Edit
                                      </DropdownItem>
                                    </li>
                                  )}

                                  {/* Delete */}
                                  {canDeleteUsers && !user.deleted_at && (
                                    <li>
                                      <DropdownItem
                                        onClick={() =>
                                          openDeleteConfirmation(user)
                                        }
                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10"
                                      >
                                        Delete
                                      </DropdownItem>
                                    </li>
                                  )}

                                  {/* Restore */}
                                  {canDeleteUsers && user.deleted_at && (
                                    <li>
                                      <DropdownItem
                                        onClick={() =>
                                          openRestoreConfirmation(user)
                                        }
                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-success-500 hover:bg-success-50 dark:hover:bg-success-500/10"
                                      >
                                        Restore
                                      </DropdownItem>
                                    </li>
                                  )}

                                  {canDeleteUsers && user.deleted_at && (
                                    <li>
                                      <DropdownItem
                                        onClick={() =>
                                          openForceDeleteConfirmation(user)
                                        }
                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm !text-error-500 hover:bg-error-50 hover:!text-error-600 dark:hover:bg-error-500/10 dark:hover:!text-error-400"
                                      >
                                        Permanently Delete
                                      </DropdownItem>
                                    </li>
                                  )}
                                </ul>
                              </Dropdown>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}

                    {/* Empty State */}
                    {!isLoading && users.length === 0 && (
                      <TableRow>
                        <TableCell className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                          {search
                            ? 'No users match your search.'
                            : trashed === 'only'
                              ? 'No deleted users found.'
                              : 'No users found.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {!isLoading && users.length > 0 && (
                <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {meta.from}–{meta.to} of {meta.total} users
                  </p>

                  {meta.last_page > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage((current) => current - 1)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
                      >
                        Previous
                      </button>

                      <span className="px-2 text-sm text-gray-500 dark:text-gray-400">
                        Page {meta.current_page} of {meta.last_page}
                      </span>

                      <button
                        type="button"
                        disabled={page >= meta.last_page}
                        onClick={() => setPage((current) => current + 1)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteUser !== null}
        onClose={closeDeleteConfirmation}
        showCloseButton={!isDeleting}
        className="max-w-md p-6"
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Delete User
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Are you sure you want to delete{' '}
            <span className="font-medium text-gray-800 dark:text-white">
              {deleteUser?.full_name}
            </span>
            ?
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            The user will be soft deleted and can be restored later.
          </p>

          {deleteError && (
            <div className="mt-4 rounded-lg border border-error-500/20 bg-error-500/5 px-4 py-3 text-sm text-error-500">
              {deleteError}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeDeleteConfirmation}
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => void handleDeleteUser()}
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-lg bg-error-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-error-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Force Delete Confirmation Modal */}
      <Modal
        isOpen={forceDeleteUser !== null}
        onClose={closeForceDeleteConfirmation}
        showCloseButton={!isForceDeleting}
        className="max-w-md p-6"
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Permanently Delete User
          </h2>

          <div className="mt-4 rounded-lg border border-error-500/20 bg-error-500/5 px-4 py-3">
            <p className="text-sm font-medium text-error-500">
              This action cannot be undone.
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              The user and their deleted record will be permanently removed from
              the system.
            </p>
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Are you sure you want to permanently delete{' '}
            <span className="font-medium text-gray-800 dark:text-white">
              {forceDeleteUser?.full_name}
            </span>
            ?
          </p>

          {forceDeleteError && (
            <div className="mt-4 rounded-lg border border-error-500/20 bg-error-500/5 px-4 py-3 text-sm text-error-500">
              {forceDeleteError}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeForceDeleteConfirmation}
              disabled={isForceDeleting}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => void handleForceDeleteUser()}
              disabled={isForceDeleting}
              className="inline-flex items-center justify-center rounded-lg bg-error-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-error-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isForceDeleting
                ? 'Permanently Deleting...'
                : 'Permanently Delete'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Restore Confirmation Modal */}
      <Modal
        isOpen={restoreUser !== null}
        onClose={closeRestoreConfirmation}
        showCloseButton={!isRestoring}
        className="max-w-md p-6"
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Restore User
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Are you sure you want to restore{' '}
            <span className="font-medium text-gray-800 dark:text-white">
              {restoreUser?.full_name}
            </span>
            ?
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            The user will become available again in the active users list.
          </p>

          {restoreError && (
            <div className="mt-4 rounded-lg border border-error-500/20 bg-error-500/5 px-4 py-3 text-sm text-error-500">
              {restoreError}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeRestoreConfirmation}
              disabled={isRestoring}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => void handleRestoreUser()}
              disabled={isRestoring}
              className="inline-flex items-center justify-center rounded-lg bg-success-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-success-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRestoring ? 'Restoring...' : 'Restore User'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
