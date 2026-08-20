import type React from 'react';

import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';

import PermissionGroups from '../permissions/PermissionGroups';

import type { Permission } from '../../types/role';

interface RoleFormProps {
  name: string;

  permissions: Permission[];

  selectedPermissions: string[];

  isSubmitting: boolean;

  isLoadingPermissions: boolean;

  canEditName: boolean;

  canManagePermissions: boolean;

  error: string;

  nameError?: string;

  submitLabel: string;

  submittingLabel: string;

  onNameChange: (value: string) => void;

  onPermissionsChange: (permissions: string[]) => void;

  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;

  onCancel: () => void;
}

export default function RoleForm({
  name,
  permissions,
  selectedPermissions,
  isSubmitting,
  isLoadingPermissions,
  canEditName,
  canManagePermissions,
  error,
  nameError,
  submitLabel,
  submittingLabel,
  onNameChange,
  onPermissionsChange,
  onSubmit,
  onCancel,
}: RoleFormProps) {
  const canSubmit = canEditName || canManagePermissions;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Role Information */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 p-5 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Role Information
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter the role name.
          </p>
        </div>

        <div className="p-5">
          <div className="max-w-xl">
            <Label htmlFor="role-name">Role Name</Label>

            <Input
              id="role-name"
              name="name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="e.g. Manager"
              disabled={isSubmitting || !canEditName}
              error={Boolean(nameError)}
              hint={nameError}
            />

            {!canEditName && (
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                You do not have permission to update the role name.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 p-5 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Permissions
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select the permissions that should be assigned to this role.
          </p>
        </div>

        <div className="p-5">
          {!canManagePermissions ? (
            <div className="rounded-lg border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-600 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-400">
              You do not have permission to manage role permissions.
            </div>
          ) : isLoadingPermissions ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
                />
              ))}
            </div>
          ) : (
            <PermissionGroups
              permissions={permissions}
              selectedPermissions={selectedPermissions}
              onChange={onPermissionsChange}
              disabled={isSubmitting}
            />
          )}
        </div>
      </div>

      {/* General Error */}
      {error && (
        <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !canSubmit ||
            (canManagePermissions && isLoadingPermissions)
          }
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden="true"
              />

              {submittingLabel}
            </span>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
