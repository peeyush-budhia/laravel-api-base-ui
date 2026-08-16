import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import { usersApi } from '../../api/users';
import { rolesApi } from '../../api/roles';

import type { Role } from '../../types/role';
import type { UpdateUserPayload, User, UserStatus } from '../../types/user';

import { useAuth } from '../../auth/useAuth';
import { permissions } from '../../auth/permissions';

import PageMeta from '../../components/common/PageMeta';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';

import { routes } from '../../routes/routes';

interface FieldErrors {
  first_name?: string[];
  last_name?: string[];
  email?: string[];
  role?: string[];
  status?: string[];
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

export default function UserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();

  const canUpdateUsers = can(permissions.usersUpdate);

  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<UserStatus>('active');

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState('');

  /**
   * Load the user being edited.
   */
  useEffect(() => {
    if (!id) {
      return;
    }

    const loadUser = async () => {
      setIsLoading(true);
      setGeneralError('');

      try {
        const response = await usersApi.show(id);

        setUser(response);

        setFirstName(response.first_name);
        setLastName(response.last_name);
        setEmail(response.email);
        setRole(response.role ?? '');
        setStatus(response.status);
      } catch {
        setUser(null);
        setGeneralError('Unable to load user. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadUser();
  }, [id]);

  /**
   * Load available roles.
   */
  useEffect(() => {
    const loadRoles = async () => {
      setIsLoadingRoles(true);

      try {
        const response = await rolesApi.list();

        setRoles(response.data);
      } catch {
        setGeneralError('Unable to load roles. Please try again.');
      } finally {
        setIsLoadingRoles(false);
      }
    };

    void loadRoles();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setGeneralError('');

    const payload: UpdateUserPayload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      role,
      status,
    };

    try {
      await usersApi.update(id, payload);

      navigate(routes.users.show(id));
    } catch (error: unknown) {
      const response = (
        error as {
          response?: {
            data?: {
              message?: string;
              errors?: FieldErrors;
            };
          };
        }
      ).response;

      setFieldErrors(response?.data?.errors ?? {});

      setGeneralError(response?.data?.message ?? 'Unable to update user.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!canUpdateUsers) {
    return (
      <>
        <PageMeta title="Edit User" description="Edit application user" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You do not have permission to update users.
          </p>

          <Link
            to={routes.users.index}
            className="mt-4 inline-flex text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            ← Back to Users
          </Link>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <PageMeta title="Edit User" description="Edit application user" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="h-7 w-40 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-11 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <PageMeta title="Edit User" description="Edit application user" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            User Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {generalError || 'The requested user could not be found.'}
          </p>

          <Link
            to={routes.users.index}
            className="mt-4 inline-flex text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            ← Back to Users
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`Edit ${user.full_name}`}
        description="Edit application user"
      />

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Edit User
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Update {user.full_name}'s account details.
            </p>
          </div>

          <Link
            to={routes.users.show(user.id)}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            ← Back to User
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <form onSubmit={handleSubmit}>
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
                  onChange={(event) => setFirstName(event.target.value)}
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
                  onChange={(event) => setLastName(event.target.value)}
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
                  onChange={(event) => setEmail(event.target.value)}
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
                  onChange={(event) => setRole(event.target.value)}
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
                    setStatus(event.target.value as UserStatus)
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

            {/* Password information */}
            <div className="mt-6 rounded-lg border border-brand-500/20 bg-brand-500/5 px-4 py-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Changing the user's profile details will not change their
                password.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                to={routes.users.show(user.id)}
                className={`inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03] ${
                  isSubmitting ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                Cancel
              </Link>

              <Button
                type="submit"
                disabled={isSubmitting || isLoadingRoles || !role}
              >
                {isSubmitting ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
