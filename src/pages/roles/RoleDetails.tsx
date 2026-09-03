import { useCallback, useEffect, useState } from 'react';

import { Link, useParams } from 'react-router';

import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PermissionGroups from '../../components/permissions/PermissionGroups';
import Badge from '../../components/ui/badge/Badge';

import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import { getApiErrorMessage } from '../../utils/apiErrorUtils';

import { rolesApi } from '../../api/roles';

import type { Permission, Role } from '../../types/role';

import { routes } from '../../routes/routes';
import { SUPER_ADMIN_ROLE } from '../../constants/roles';

import { permissions as authPermissions } from '../../auth/permissions';

import { formatDateTime } from '../../utils/dateTimeUtils';
import { useAuthorization } from '../../auth/useAuthorization';

export default function RoleDetails() {
  const { id } = useParams<{ id: string }>();

  const { can } = useAuthorization();

  const canViewRoles = can(authPermissions.roles.view);

  const [role, setRole] = useState<Role | null>(null);
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRole = useCallback(async () => {
    if (!id) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const [roleData, permissionsData] = await Promise.all([
        rolesApi.show(id),
        rolesApi.permissions(id),
      ]);
      setRole(roleData);
      setRolePermissions(permissionsData);
    } catch (error: unknown) {
      setError(
        getApiErrorMessage(
          error,
          'Unable to load role details. Please try again.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const timer = window.setTimeout(() => {
      void loadRole();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [id, loadRole]);

  if (!canViewRoles) {
    return (
      <>
        <PageMeta
          title="Role Details"
          description="View role details and permissions"
        />

        <PageBreadcrumb pageTitle="Role Details" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            You do not have permission to view roles.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={role ? role.name : 'Role Details'}
        description="View role details and permissions"
      />

      <PageBreadcrumb pageTitle={role ? role.name : 'Role Details'} />

      <div className="space-y-6">
        {/* Back */}
        <div>
          <Link
            to={routes.roles.index}
            className="text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            ← Back to Roles
          </Link>
        </div>

        {/* Loading */}
        {isLoading && <LoadingState message="Loading role..." />}

        {/* Error */}
        {!isLoading && error && (
          <ErrorState message={error} onRetry={() => void loadRole()} />
        )}

        {/* Role */}
        {!isLoading && !error && role && (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="border-b border-gray-200 p-5 dark:border-gray-800">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        {role.name}
                      </h1>

                      {role.name === SUPER_ADMIN_ROLE ? (
                        <Badge size="sm" color="warning">
                          Protected
                        </Badge>
                      ) : (
                        <Badge size="sm" color="success">
                          Active
                        </Badge>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Role details and assigned permissions.
                    </p>
                  </div>

                  {role.name !== SUPER_ADMIN_ROLE && (
                    <Link
                      to={routes.roles.edit(role.id)}
                      className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                    >
                      Edit Role
                    </Link>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-gray-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Role
                  </p>

                  <p className="mt-2 text-sm font-medium text-gray-800 dark:text-white/90">
                    {role.name}
                  </p>
                </div>

                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Guard
                  </p>

                  <p className="mt-2 text-sm font-medium text-gray-800 dark:text-white/90">
                    {role.guard_name}
                  </p>
                </div>

                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Created At
                  </p>

                  <p className="mt-2 text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatDateTime(role.created_at)}
                  </p>
                </div>
              </div>

              {role.name === SUPER_ADMIN_ROLE && (
                <div className="border-t border-gray-200 px-5 py-4 dark:border-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This is a protected system role. Its name and permissions
                    cannot be modified.
                  </p>
                </div>
              )}
            </div>

            {/* Permissions */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="border-b border-gray-200 p-5 dark:border-gray-800">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                      Permissions
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Permissions currently assigned to this role.
                    </p>
                  </div>

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {rolePermissions.length}{' '}
                    {rolePermissions.length === 1
                      ? 'permission'
                      : 'permissions'}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <PermissionGroups
                  permissions={rolePermissions}
                  selectedPermissions={rolePermissions.map(
                    (permission) => permission.name,
                  )}
                  onChange={() => undefined}
                  readOnly
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
