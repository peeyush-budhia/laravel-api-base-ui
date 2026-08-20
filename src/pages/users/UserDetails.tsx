import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { usersApi } from '../../api/users';
import {
  userStatusColors,
  userStatusLabels,
  type User,
} from '../../types/user';
import { useAuth } from '../../auth/useAuth';
import { permissions } from '../../auth/permissions';
import PageMeta from '../../components/common/PageMeta';
import Badge from '../../components/ui/badge/Badge';
import { routes } from '../../routes/routes';

import { formatDateTime } from '../../utils/dateTimeUtils';

function UserAvatar({ user }: { user: User }) {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.full_name}
        className="h-24 w-24 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-50 text-2xl font-semibold text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
      {user.full_name.charAt(0).toUpperCase()}
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>

      <p className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">
        {value}
      </p>
    </div>
  );
}

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { can } = useAuth();

  const canViewUsers = can(permissions.usersView);
  const canUpdateUsers = can(permissions.usersUpdate);

  useEffect(() => {
    if (!id || !canViewUsers) {
      return;
    }

    const loadUser = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await usersApi.show(id);
        setUser(response);
      } catch {
        setUser(null);
        setError('Unable to load user details.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadUser();
  }, [id, canViewUsers]);
  if (!canViewUsers) {
    return (
      <>
        <PageMeta title="User Details" description="View user details" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You do not have permission to view user details.
          </p>

          <Link
            to={routes.users.index}
            className="mt-4 inline-flex rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white"
          >
            Back to Users
          </Link>
        </div>
      </>
    );
  }
  return (
    <>
      <PageMeta
        title={user ? user.full_name : 'User Details'}
        description="View user details"
      />

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              User Details
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View application user information.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {canUpdateUsers && user && (
              <Link
                to={routes.users.edit(user.id)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
              >
                Edit User
              </Link>
            )}

            <Link
              to="/users"
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              ← Back to Users
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center gap-5">
                <div className="h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800" />

                <div className="space-y-3">
                  <div className="h-5 w-48 rounded bg-gray-100 dark:bg-gray-800" />
                  <div className="h-4 w-64 rounded bg-gray-100 dark:bg-gray-800" />
                </div>
              </div>

              <div className="grid gap-6 border-t border-gray-100 pt-6 sm:grid-cols-2 dark:border-gray-800">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index}>
                    <div className="h-4 w-24 rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="mt-2 h-5 w-40 rounded bg-gray-100 dark:bg-gray-800" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl border border-error-200 bg-error-50 p-5 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            {error}
          </div>
        )}

        {!isLoading && !error && user && (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <UserAvatar user={user} />

                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    {user.full_name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge size="sm" color={userStatusColors[user.status]}>
                      {userStatusLabels[user.status]}
                    </Badge>

                    {user.role && (
                      <Badge size="sm" color="info">
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Personal Information
              </h3>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem label="First Name" value={user.first_name} />
                <DetailItem label="Last Name" value={user.last_name} />
                <DetailItem label="Email" value={user.email} />

                <DetailItem
                  label="Role"
                  value={
                    user.role ? (
                      <Badge size="sm" color="info">
                        {user.role}
                      </Badge>
                    ) : (
                      '—'
                    )
                  }
                />

                <DetailItem
                  label="Status"
                  value={
                    <Badge size="sm" color={userStatusColors[user.status]}>
                      {userStatusLabels[user.status]}
                    </Badge>
                  }
                />

                <DetailItem
                  label="Email Verifiled"
                  value={
                    user.email_verified_at ? (
                      <Badge size="sm" color="success">
                        Verified
                      </Badge>
                    ) : (
                      <Badge size="sm" color="error">
                        Not Verified
                      </Badge>
                    )
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Account Information
              </h3>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Last Login"
                  value={formatDateTime(user.last_login_at)}
                />

                <DetailItem
                  label="Created"
                  value={formatDateTime(user.created_at)}
                />

                <DetailItem
                  label="Updated"
                  value={formatDateTime(user.updated_at)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
