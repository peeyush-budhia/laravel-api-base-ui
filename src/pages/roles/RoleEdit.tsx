import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import RoleForm from '../../components/roles/RoleForm';

import { rolesApi } from '../../api/roles';

import type { Permission } from '../../types/role';

import { routes } from '../../routes/routes';
import { SUPER_ADMIN_ROLE } from '../../constants/roles';

import { useAuth } from '../../auth/useAuth';
import { permissions as authPermissions } from '../../auth/permissions';

export default function RoleEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { can } = useAuth();

  const canUpdateRoles = can(authPermissions.rolesUpdate);

  const canManageRolePermissions = can(authPermissions.rolesManagePermissions);

  const canEditRole = canUpdateRoles || canManageRolePermissions;

  const [name, setName] = useState('');

  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState('');

  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (!canEditRole || !id) {
      return;
    }

    let cancelled = false;

    const loadRole = async () => {
      try {
        setIsLoading(true);
        setError('');
        setNameError('');

        const role = await rolesApi.show(id);

        if (cancelled) {
          return;
        }

        setName(role.name);

        /*
         * Only load permission data when the current
         * user has permission to manage permissions.
         */
        if (canManageRolePermissions) {
          setIsLoadingPermissions(true);

          const [allPermissions, rolePermissions] = await Promise.all([
            rolesApi.allPermissions(),
            rolesApi.permissions(id),
          ]);

          if (cancelled) {
            return;
          }

          setPermissions(allPermissions);

          setSelectedPermissions(
            rolePermissions.map((permission) => permission.name),
          );
        }
      } catch {
        if (cancelled) {
          return;
        }

        setError('Unable to load role. Please try again.');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsLoadingPermissions(false);
        }
      }
    };

    void loadRole();

    return () => {
      cancelled = true;
    };
  }, [canEditRole, canManageRolePermissions, id]);

  if (!canEditRole) {
    return (
      <>
        <PageMeta title="Edit Role" description="Edit role and permissions" />

        <PageBreadcrumb pageTitle="Edit Role" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            You do not have permission to edit roles or manage role permissions.
          </div>
        </div>
      </>
    );
  }

  if (!id) {
    return (
      <>
        <PageMeta title="Edit Role" description="Edit role and permissions" />

        <PageBreadcrumb pageTitle="Edit Role" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            Invalid role ID.
          </div>
        </div>
      </>
    );
  }

  const roleId = id;

  if (isLoading) {
    return (
      <>
        <PageMeta title="Edit Role" description="Edit role and permissions" />

        <PageBreadcrumb pageTitle="Edit Role" />

        <div className="space-y-6">
          <div>
            <Link
              to={routes.roles.index}
              className="text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              ← Back to Roles
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="space-y-4">
              <div className="h-6 w-48 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />

              <div className="h-4 w-72 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />

              <div className="h-10 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>

          {canManageRolePermissions && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="h-6 w-40 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />

              <div className="mt-6 space-y-4">
                <div className="h-32 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />

                <div className="h-32 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  const isProtectedRole = name === SUPER_ADMIN_ROLE;

  if (isProtectedRole) {
    return (
      <>
        <PageMeta title="Edit Role" description="Edit role and permissions" />

        <PageBreadcrumb pageTitle="Edit Role" />

        <div className="space-y-6">
          <div>
            <Link
              to={routes.roles.show(id)}
              className="text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              ← Back to Role
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="rounded-lg border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-600 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-400">
              This is a protected system role. Its name and permissions cannot
              be modified.
            </div>
          </div>
        </div>
      </>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (isProtectedRole) {
      setError('The Super Admin role cannot be modified.');

      return;
    }

    const trimmedName = name.trim();

    if (canUpdateRoles && !trimmedName) {
      setNameError('Role name is required.');

      return;
    }

    setNameError('');
    setError('');
    setIsSubmitting(true);

    try {
      /*
       * Update role name only when authorized.
       */
      if (canUpdateRoles) {
        await rolesApi.update(roleId, {
          name: trimmedName,
        });
      }

      /*
       * Synchronize permissions only when authorized.
       */
      if (canManageRolePermissions) {
        await rolesApi.syncPermissions(roleId, selectedPermissions);
      }

      navigate(routes.roles.show(roleId));
    } catch (requestError: unknown) {
      const response = requestError as {
        response?: {
          data?: {
            errors?: {
              name?: string[];
              permissions?: string[];
            };
            message?: string;
          };
        };
      };

      const validationError = response.response?.data?.errors?.name?.[0];

      setNameError(validationError ?? '');

      setError(
        validationError
          ? ''
          : (response.response?.data?.message ??
              'Unable to update role. Please try again.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageMeta
        title={`Edit ${name}`}
        description="Edit role and permissions"
      />

      <PageBreadcrumb pageTitle={`Edit ${name}`} />

      <div className="space-y-6">
        <div>
          <Link
            to={routes.roles.show(roleId)}
            className="text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            ← Back to Role
          </Link>
        </div>

        <RoleForm
          name={name}
          permissions={permissions}
          selectedPermissions={selectedPermissions}
          isSubmitting={isSubmitting}
          isLoadingPermissions={isLoadingPermissions}
          canEditName={canUpdateRoles}
          canManagePermissions={canManageRolePermissions}
          error={error}
          nameError={nameError}
          submitLabel="Update Role"
          submittingLabel="Updating..."
          onNameChange={setName}
          onPermissionsChange={setSelectedPermissions}
          onSubmit={handleSubmit}
          onCancel={() => navigate(routes.roles.show(id))}
        />
      </div>
    </>
  );
}
