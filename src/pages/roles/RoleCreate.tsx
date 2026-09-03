import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';

import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import RoleForm from '../../components/roles/RoleForm';

import { rolesApi } from '../../api/roles';

import type { Permission } from '../../types/role';

import { routes } from '../../routes/routes';
import {
  getApiErrorMessage,
  getApiFieldErrors,
} from '../../utils/apiErrorUtils';

import { permissions as authPermissions } from '../../auth/permissions';
import { useAuthorization } from '../../auth/useAuthorization';

export default function RoleCreate() {
  const navigate = useNavigate();

  const { can } = useAuthorization();

  const canCreateRoles = can(authPermissions.roles.create);

  const canManageRolePermissions = can(authPermissions.roles.managePermissions);

  const [name, setName] = useState('');

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState('');

  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (!canCreateRoles || !canManageRolePermissions) {
      return;
    }

    let cancelled = false;

    const fetchPermissions = async () => {
      setIsLoadingPermissions(true);
      setError('');

      try {
        const data = await rolesApi.allPermissions();

        if (cancelled) {
          return;
        }

        setPermissions(data);
      } catch {
        if (cancelled) {
          return;
        }

        setPermissions([]);

        setError('Unable to load permissions. Please try again.');
      } finally {
        if (!cancelled) {
          setIsLoadingPermissions(false);
        }
      }
    };

    void fetchPermissions();

    return () => {
      cancelled = true;
    };
  }, [canCreateRoles, canManageRolePermissions]);

  function handleNameChange(value: string) {
    setName(value);

    if (nameError) {
      setNameError('');
    }
  }

  function handlePermissionsChange(permissionNames: string[]) {
    setSelectedPermissions(permissionNames);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError('');
    setNameError('');

    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError('Role name is required.');

      return;
    }

    void createRole(trimmedName);
  }

  async function createRole(roleName: string) {
    setIsSubmitting(true);

    try {
      const role = await rolesApi.create({
        name: roleName,
      });

      /*
       * Only synchronize permissions when the
       * current user has permission to do so.
       */
      if (canManageRolePermissions) {
        await rolesApi.syncPermissions(role.id, {
          permissions: selectedPermissions,
        });
      }

      navigate(routes.roles.show(role.id), {
        replace: true,
      });
    } catch (requestError: unknown) {
      const validationErrors = getApiFieldErrors(requestError);

      const roleNameValidationError = validationErrors?.name?.[0];

      if (roleNameValidationError) {
        setNameError(roleNameValidationError);
      } else {
        setError(
          getApiErrorMessage(
            requestError,
            'Unable to create role. Please try again.',
          ),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    navigate(routes.roles.index);
  }

  if (!canCreateRoles) {
    return (
      <>
        <PageMeta
          title="Create Role"
          description="Create a new application role"
        />

        <PageBreadcrumb pageTitle="Create Role" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            You do not have permission to create roles.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Create Role"
        description="Create a new application role"
      />

      <PageBreadcrumb pageTitle="Create Role" />

      <div className="space-y-6">
        <div>
          <Link
            to={routes.roles.index}
            className="text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            ← Back to Roles
          </Link>
        </div>

        <RoleForm
          name={name}
          permissions={permissions}
          selectedPermissions={selectedPermissions}
          isSubmitting={isSubmitting}
          isLoadingPermissions={isLoadingPermissions}
          canEditName={true}
          canManagePermissions={canManageRolePermissions}
          error={error}
          nameError={nameError}
          submitLabel="Save Role"
          submittingLabel="Saving..."
          onNameChange={handleNameChange}
          onPermissionsChange={handlePermissionsChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </>
  );
}
