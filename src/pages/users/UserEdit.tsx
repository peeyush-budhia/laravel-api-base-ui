import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import { usersApi } from '../../api/users';
import { rolesApi } from '../../api/roles';

import type { Role } from '../../types/role';
import type { UpdateUserPayload, User, UserStatus } from '../../types/user';

import { useAuth } from '../../auth/useAuth';
import { permissions } from '../../auth/permissions';

import PageMeta from '../../components/common/PageMeta';
import UserForm from '../../components/users/UserForm';

import { routes } from '../../routes/routes';

interface FieldErrors {
  first_name?: string[];
  last_name?: string[];
  email?: string[];
  role?: string[];
  status?: string[];
}

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

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    const loadUser = async () => {
      try {
        const response = await usersApi.show(id);

        if (cancelled) {
          return;
        }

        setUser(response);
        setFirstName(response.first_name);
        setLastName(response.last_name);
        setEmail(response.email);
        setRole(response.role ?? '');
        setStatus(response.status);
      } catch {
        if (!cancelled) {
          setUser(null);
          setGeneralError('Unable to load user. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    const loadRoles = async () => {
      try {
        const response = await rolesApi.list();

        if (!cancelled) {
          setRoles(response.data);
        }
      } catch {
        if (!cancelled) {
          setGeneralError('Unable to load roles. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingRoles(false);
        }
      }
    };

    void loadRoles();

    return () => {
      cancelled = true;
    };
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
          <UserForm
            firstName={firstName}
            lastName={lastName}
            email={email}
            role={role}
            status={status}
            roles={roles}
            isLoadingRoles={isLoadingRoles}
            isSubmitting={isSubmitting}
            fieldErrors={fieldErrors}
            generalError={generalError}
            submitLabel="Update User"
            submittingLabel="Updating..."
            passwordMessage="Changing the user's profile details will not change their password."
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onEmailChange={setEmail}
            onRoleChange={setRole}
            onStatusChange={setStatus}
            onSubmit={handleSubmit}
            onCancel={() => navigate(routes.users.show(user.id))}
          />
        </div>
      </div>
    </>
  );
}
