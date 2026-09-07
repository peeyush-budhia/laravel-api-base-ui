import type { DashboardUser } from '../../types/dashboard';
import EmptyState from '../common/EmptyState';
import Badge from '../ui/badge/Badge';
import { getDisplayName, getInitials } from '../../utils/dashboardUtils';

interface RecentUsersProps {
  users: DashboardUser[];
}

export default function RecentUsers({ users }: RecentUsersProps) {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent Users
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Recently registered users
        </p>
      </div>

      {users.length === 0 ? (
        <EmptyState
          title="No recent users"
          message="Newly registered users will appear here."
        />
      ) : (
        <div className="space-y-4">
          {users.map((user) => {
            const displayName = getDisplayName(user);

            return (
              <div
                key={user.id}
                className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 dark:border-gray-800"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={displayName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                        {getInitials(displayName)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {displayName}
                    </p>

                    <p className="truncate text-gray-500 text-theme-xs dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Badge
                  size="sm"
                  color={
                    user.status === 'active'
                      ? 'success'
                      : user.status === 'suspended'
                        ? 'error'
                        : 'warning'
                  }
                >
                  {user.status}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
