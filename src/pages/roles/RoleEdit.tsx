import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import LoadingState from '../../components/common/LoadingState';

import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { useToast } from '../../components/common/useToast';
import RoleForm from '../../components/roles/RoleForm';
import RolePermissionsConfirmationModal from '../../components/roles/RolePermissionsConfirmationModal';

import { rolesApi } from '../../api/roles';

import type { Permission } from '../../types/role';

import { routes } from '../../routes/routes';
import {
  getApiErrorMessage,
  getApiFieldErrors,
} from '../../utils/apiErrorUtils';
import { SUPER_ADMIN_ROLE } from '../../constants/roles';

import { permissions as authPermissions } from '../../auth/permissions';
import { useAuthorization } from '../../auth/useAuthorization';

export default function RoleEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { can } = useAuthorization();

  const canUpdateRoles = can(authPermissions.roles.update);

  const canManageRolePermissions = can(authPermissions.roles.managePermissions);

  const canEditRole = canUpdateRoles || canManageRolePermissions;

  const [name, setName] = useState('');

  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [permissionsLoadError, setPermissionsLoadError] = useState('');
  const [hasLoadedRole, setHasLoadedRole] = useState(false);
  const [originalPermissions, setOriginalPermissions] = useState<string[]>([]);
  const [isPermissionConfirmationOpen, setIsPermissionConfirmationOpen] =
    useState(false);
  const [pendingRoleName, setPendingRoleName] = useState('');

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
        setPermissionsLoadError('');
        setNameError('');
        setHasLoadedRole(false);

        const role = await rolesApi.show(id);

        if (cancelled) {
          return;
        }

        setName(role.name);
        setPendingRoleName(role.name);
        setHasLoadedRole(true);
      } catch {
        if (cancelled) {
          return;
        }

        setHasLoadedRole(false);
        setError('Unable to load role. Please try again.');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadRole();

    return () => {
      cancelled = true;
    };
  }, [canEditRole, canManageRolePermissions, id]);

  useEffect(() => {
    if (!canManageRolePermissions || !id || !hasLoadedRole) {
      return;
    }

    let cancelled = false;

    const loadPermissions = async () => {
      setIsLoadingPermissions(true);
      setPermissionsLoadError('');

      try {
        const [allPermissions, rolePermissions] = await Promise.all([
          rolesApi.allPermissions(),
          rolesApi.permissions(id),
        ]);

        if (cancelled) {
          return;
        }

        setPermissions(allPermissions);
        const permissionNames = rolePermissions.map(
          (permission) => permission.name,
        );

        setSelectedPermissions(permissionNames);
        setOriginalPermissions(permissionNames);
      } catch {
        if (!cancelled) {
          setPermissionsLoadError(
            'Unable to load permissions. Please try again.',
          );
          setPermissions([]);
          setSelectedPermissions([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingPermissions(false);
        }
      }
    };

    const timer = window.setTimeout(() => {
      void loadPermissions();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [canManageRolePermissions, hasLoadedRole, id]);

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
    <LoadingState message="Loading role..." />;
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
    setPermissionsLoadError('');

    const permissionNamesChanged =
      canManageRolePermissions &&
      selectedPermissions.join('|') !== originalPermissions.join('|');

    if (permissionNamesChanged) {
      setPendingRoleName(canUpdateRoles ? trimmedName : name);
      setIsPermissionConfirmationOpen(true);

      return;
    }

    await updateRole(trimmedName, false);
  }

  async function updateRole(roleName: string, shouldSyncPermissions: boolean) {
    setIsSubmitting(true);

    try {
      /*
       * Update role name only when authorized.
       */
      if (canUpdateRoles) {
        await rolesApi.update(roleId, {
          name: roleName,
        });
      }

      /*
       * Synchronize permissions only when authorized.
       */
      if (canManageRolePermissions && shouldSyncPermissions) {
        await rolesApi.syncPermissions(roleId, {
          permissions: selectedPermissions,
        });
      }

      showToast({
        title: 'Role Updated',
        message: 'The role has been updated successfully.',
      });

      navigate(routes.roles.show(roleId));
    } catch (requestError: unknown) {
      const validationError = getApiFieldErrors(requestError).name?.[0];

      setNameError(validationError ?? '');

      setError(
        validationError
          ? ''
          : getApiErrorMessage(
              requestError,
              'Unable to update role. Please try again.',
            ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleConfirmPermissionChanges() {
    setIsPermissionConfirmationOpen(false);

    void updateRole(pendingRoleName, true);
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
          permissionsError={permissionsLoadError}
          nameError={nameError}
          submitLabel="Update Role"
          submittingLabel="Updating..."
          onNameChange={setName}
          onPermissionsChange={setSelectedPermissions}
          onSubmit={handleSubmit}
          onCancel={() => navigate(routes.roles.show(id))}
        />
      </div>

      <RolePermissionsConfirmationModal
        isOpen={isPermissionConfirmationOpen}
        roleName={pendingRoleName}
        permissionCount={selectedPermissions.length}
        isSubmitting={isSubmitting}
        error={error}
        onClose={() => {
          if (!isSubmitting) {
            setIsPermissionConfirmationOpen(false);
          }
        }}
        onConfirm={handleConfirmPermissionChanges}
      />
    </>
  );
}
