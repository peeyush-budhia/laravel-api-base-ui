import type React from 'react';

import type { Role } from '../../types/role';
import type { UserStatus } from '../../types/user';

import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';

interface FieldErrors {
  first_name?: string[];
  last_name?: string[];
  email?: string[];
  role?: string[];
  status?: string[];
  avatar?: string[];
}

interface UserFormProps {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: UserStatus;

  roles: Role[];
  isLoadingRoles: boolean;

  isSubmitting: boolean;

  fieldErrors: FieldErrors;
  generalError: string;

  passwordMessage: string;

  submitLabel: string;
  submittingLabel: string;

  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: UserStatus) => void;

  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const statuses: Array<{
  value: UserStatus;
  label: string;
}> = [
  {
    value: 'active',
    label: 'Active',
  },
  {
    value: 'inactive',
    label: 'Inactive',
  },
  {
    value: 'suspended',
    label: 'Suspended',
  },
];

export default function UserForm({
  firstName,
  lastName,
  email,
  role,
  status,
  roles,
  isLoadingRoles,
  isSubmitting,
  fieldErrors,
  generalError,
  submitLabel,
  submittingLabel,
  passwordMessage,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onRoleChange,
  onStatusChange,
  onSubmit,
  onCancel,
}: UserFormProps) {
  return (
    <form onSubmit={onSubmit}>
      {generalError && (
        <div className="mb-6 rounded-lg border border-error-500/20 bg-error-500/5 px-4 py-3 text-sm text-error-500">
          {generalError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
        {/* First Name */}
        <div>
          <Label>
            First Name <span className="text-error-500">*</span>
          </Label>

          <Input
            value={firstName}
            onChange={(event) => onFirstNameChange(event.target.value)}
            placeholder="Enter first name"
            disabled={isSubmitting}
            error={Boolean(fieldErrors.first_name)}
            hint={fieldErrors.first_name?.[0]}
          />
        </div>

        {/* Last Name */}
        <div>
          <Label>
            Last Name <span className="text-error-500">*</span>
          </Label>

          <Input
            value={lastName}
            onChange={(event) => onLastNameChange(event.target.value)}
            placeholder="Enter last name"
            disabled={isSubmitting}
            error={Boolean(fieldErrors.last_name)}
            hint={fieldErrors.last_name?.[0]}
          />
        </div>

        {/* Email */}
        <div className="lg:col-span-2">
          <Label>
            Email Address <span className="text-error-500">*</span>
          </Label>

          <Input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="Enter email address"
            disabled={isSubmitting}
            error={Boolean(fieldErrors.email)}
            hint={fieldErrors.email?.[0]}
          />
        </div>

        {/* Role */}
        <div>
          <Label>
            Role <span className="text-error-500">*</span>
          </Label>

          <select
            value={role}
            onChange={(event) => onRoleChange(event.target.value)}
            disabled={isSubmitting || isLoadingRoles}
            className={`h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm shadow-theme-xs outline-hidden transition ${
              fieldErrors.role
                ? 'border-error-500 focus:border-error-300 focus:ring-3 focus:ring-error-500/20'
                : 'border-gray-300 text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800'
            }`}
          >
            <option value="" disabled>
              {isLoadingRoles ? 'Loading roles...' : 'Select role'}
            </option>

            {roles.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          {fieldErrors.role?.[0] && (
            <p className="mt-1.5 text-xs text-error-500">
              {fieldErrors.role[0]}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <Label>
            Status <span className="text-error-500">*</span>
          </Label>

          <select
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as UserStatus)
            }
            disabled={isSubmitting}
            className={`h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm shadow-theme-xs outline-hidden transition ${
              fieldErrors.status
                ? 'border-error-500 focus:border-error-300 focus:ring-3 focus:ring-error-500/20'
                : 'border-gray-300 text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800'
            }`}
          >
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          {fieldErrors.status?.[0] && (
            <p className="mt-1.5 text-xs text-error-500">
              {fieldErrors.status[0]}
            </p>
          )}
        </div>
      </div>

      {/* Password Information */}
      <div className="mt-6 rounded-lg border border-brand-500/20 bg-brand-500/5 px-4 py-3">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {passwordMessage}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
          disabled={isSubmitting || isLoadingRoles || !role}
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
