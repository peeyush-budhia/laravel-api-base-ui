import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';

import { rolesApi } from '../../api/roles';

import type { Role } from '../../types/role';
import type { PaginationMeta } from '../../types/pagination';

import { useAuth } from '../../auth/useAuth';
import { permissions } from '../../auth/permissions';

import PageMeta from '../../components/common/PageMeta';
import Pagination from '../../components/common/Pagination';

import RoleFilters from '../../components/roles/RoleFilters';
import RoleTable from '../../components/roles/RoleTable';
import RoleActionConfirmationModal from '../../components/roles/RoleActionConfirmationModal';

import { routes } from '../../routes/routes';

const PER_PAGE = 15;

export default function Roles() {
  const { can } = useAuth();

  const canViewRoles = can(permissions.rolesView);
  const canCreateRoles = can(permissions.rolesCreate);
  const canUpdateRoles = can(permissions.rolesUpdate);
  const canDeleteRoles = can(permissions.rolesDelete);
  const canManageRolePermissions = can(permissions.rolesManagePermissions);
  const [roles, setRoles] = useState<Role[]>([]);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [sort, setSort] = useState('name');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');

  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: PER_PAGE,
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

  /*
   * Delete
   */
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loadRoles = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await rolesApi.list({
        page,
        perPage: PER_PAGE,
        search,
        sort,
        direction,
      });

      setRoles(response.data);
      setMeta(response.meta);
    } catch {
      setRoles([]);
      setError('Unable to load roles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, sort, direction]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRoles();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadRoles]);

  /*
   * Search
   */
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

  /*
   * Sorting
   */
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
  function openDeleteConfirmation(role: Role) {
    setDeleteError('');
    setDeleteRole(role);
  }

  function closeDeleteConfirmation() {
    if (isDeleting) {
      return;
    }

    setDeleteRole(null);
    setDeleteError('');
  }

  async function handleDeleteRole() {
    if (!deleteRole || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      await rolesApi.remove(deleteRole.id);

      setDeleteRole(null);

      await loadRoles();
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
        response?.data?.message ?? 'Unable to delete role. Please try again.',
      );
    } finally {
      setIsDeleting(false);
    }
  }

  /*
   * Permission guard
   */
  if (!canViewRoles) {
    return (
      <>
        <PageMeta
          title="Roles & Permissions"
          description="Manage application roles and permissions"
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You do not have permission to view roles.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Roles & Permissions"
        description="Manage application roles and permissions"
      />

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Roles & Permissions
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage application roles and their permissions.
            </p>
          </div>

          {canCreateRoles && (
            <Link
              to={routes.roles.create}
              className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
            >
              Add Role
            </Link>
          )}
        </div>

        {/* Roles Card */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Filters */}
          <div className="border-b border-gray-200 p-5 dark:border-gray-800">
            <RoleFilters
              searchInput={searchInput}
              search={search}
              onSearchInputChange={setSearchInput}
              onSearchSubmit={handleSearchSubmit}
              onClearSearch={handleClearSearch}
            />
          </div>

          {/* General Error */}
          {error && (
            <div className="p-5">
              <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
                {error}
              </div>

              <button
                type="button"
                onClick={() => void loadRoles()}
                className="mt-3 text-sm font-medium text-brand-500 hover:text-brand-600"
              >
                Try again
              </button>
            </div>
          )}

          {!error && (
            <>
              {/* Roles Table */}
              <div className="overflow-x-auto">
                <RoleTable
                  roles={roles}
                  isLoading={isLoading}
                  sort={sort}
                  direction={direction}
                  canView={canViewRoles}
                  canUpdate={canUpdateRoles}
                  canDelete={canDeleteRoles}
                  canManagePermissions={canManageRolePermissions}
                  onSort={handleSort}
                  onDelete={openDeleteConfirmation}
                />
              </div>

              {/* Pagination */}
              {!isLoading && (
                <Pagination
                  meta={meta}
                  page={page}
                  onPageChange={setPage}
                  resourceLabel="roles"
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <RoleActionConfirmationModal
        role={deleteRole}
        isSubmitting={isDeleting}
        error={deleteError}
        onClose={closeDeleteConfirmation}
        onConfirm={() => void handleDeleteRole()}
      />
    </>
  );
}
