import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';

import { usersApi } from '../../api/users';
import { rolesApi } from '../../api/roles';

import type { Role } from '../../types/role';
import type { UserStatus } from '../../types/user';

import PageMeta from '../../components/common/PageMeta';
import UserForm from '../../components/users/UserForm';

import { routes } from '../../routes/routes';

interface FieldErrors {
  first_name?: string[];
  last_name?: string[];
  email?: string[];
  role?: string[];
  status?: string[];
  avatar?: string[];
}

export default function UserCreate() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<UserStatus>('active');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadRoles = async () => {
      try {
        const response = await rolesApi.list();

        if (cancelled) {
          return;
        }

        setRoles(response.data);

        if (response.data.length > 0) {
          setRole(response.data[0].name);
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

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setGeneralError('');

    try {
      await usersApi.create({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        role,
        status,
      });

      navigate(routes.users.index);
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
      setGeneralError(response?.data?.message ?? 'Unable to create user.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageMeta
        title="Create User"
        description="Create a new application user"
      />

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Create User
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create a new application user.
            </p>
          </div>

          <Link
            to={routes.users.index}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            ← Back to Users
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
            submitLabel="Save User"
            submittingLabel="Saving..."
            passwordMessage="A secure password will be generated automatically and sent to the user's email address. The user will be required to change the password after the first login."
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onEmailChange={setEmail}
            onRoleChange={setRole}
            onStatusChange={setStatus}
            onSubmit={handleSubmit}
            onCancel={() => navigate(routes.users.index)}
          />
        </div>
      </div>
    </>
  );
}
