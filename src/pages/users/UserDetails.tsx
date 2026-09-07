import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import { permissions } from '../../auth/permissions';
import { useAuthorization } from '../../auth/useAuthorization';
import { usersApi } from '../../api/users';
import type { User } from '../../types/user';
import { userStatusColors, userStatusLabels } from '../../types/user';
import { routes } from '../../routes/routes';
import { SUPER_ADMIN_ROLE } from '../../constants/roles';
import { getApiErrorMessage } from '../../utils/apiErrorUtils';
import { formatDateTime } from '../../utils/dateTimeUtils';

import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { useToast } from '../../components/common/useToast';
import Badge from '../../components/ui/badge/Badge';
import UserActionConfirmationModal from '../../components/users/UserActionConfirmationModal';

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
  const navigate = useNavigate();

  const { can } = useAuthorization();
  const { showToast } = useToast();

  const canViewUsers = can(permissions.users.view);
  const canUpdateUsers = can(permissions.users.update);
  const canDeleteUsers = can(permissions.users.delete);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const editableUser =
    canUpdateUsers && user && user.role !== SUPER_ADMIN_ROLE ? user : null;

  const loadUser = useCallback(async () => {
    if (!id || !canViewUsers) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await usersApi.show(id);

      setUser(response);
    } catch (error: unknown) {
      setUser(null);

      setError(
        getApiErrorMessage(
          error,
          'Unable to load user details. Please try again.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [id, canViewUsers]);

  useEffect(() => {
    if (!id || !canViewUsers) {
      return;
    }

    const timer = window.setTimeout(() => {
      void loadUser();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [id, canViewUsers, loadUser]);

  function closeDeleteConfirmation() {
    if (isDeleting) {
      return;
    }

    setDeleteUser(null);
    setDeleteError('');
  }

  async function handleDeleteUser() {
    if (!deleteUser || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      await usersApi.delete(deleteUser.id);

      setDeleteUser(null);
      showToast({
        title: 'User Deleted',
        message: 'The user has been deleted successfully.',
      });
      navigate(routes.users.index);
    } catch (error: unknown) {
      setDeleteError(
        getApiErrorMessage(error, 'Unable to delete user. Please try again.'),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <PageMeta
        title={user ? user.full_name : 'User Details'}
        description="View user details"
      />

      <PageBreadcrumb pageTitle={user ? user.full_name : 'User Details'} />

      <div className="space-y-6">
        <div>
          <Link
            to={routes.users.index}
            className="text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            ← Back to Users
          </Link>
        </div>

        {isLoading && <LoadingState message="Loading user details..." />}

        {!isLoading && error && (
          <ErrorState
            title="Unable to load user"
            message={error}
            onRetry={() => {
              void loadUser();
            }}
          />
        )}

        {!isLoading && !error && !user && (
          <EmptyState
            title="User not found"
            message="The requested user could not be found."
            action={
              <Link
                to={routes.users.index}
                className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
              >
                Back to Users
              </Link>
            }
          />
        )}

        {!isLoading && !error && user && (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
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

                {user.role !== SUPER_ADMIN_ROLE &&
                  (editableUser || canDeleteUsers) && (
                    <div className="flex flex-wrap items-center gap-3">
                      {editableUser && (
                        <Link
                          to={routes.users.edit(editableUser.id)}
                          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                        >
                          Edit User
                        </Link>
                      )}

                      {canDeleteUsers && (
                        <button
                          type="button"
                          onClick={() => setDeleteUser(user)}
                          className="inline-flex items-center justify-center rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-error-600"
                        >
                          Delete User
                        </button>
                      )}
                    </div>
                  )}
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
                  label="Email Verified"
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

      <UserActionConfirmationModal
        user={deleteUser}
        action="delete"
        isSubmitting={isDeleting}
        error={deleteError}
        onClose={closeDeleteConfirmation}
        onConfirm={() => void handleDeleteUser()}
      />
    </>
  );
}
