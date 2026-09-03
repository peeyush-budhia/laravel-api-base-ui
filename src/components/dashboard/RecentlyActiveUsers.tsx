import type { DashboardUser } from '../../types/dashboard';
import EmptyState from '../common/EmptyState';

interface RecentlyActiveUsersProps {
  users: DashboardUser[];
}

export default function RecentlyActiveUsers({
  users,
}: RecentlyActiveUsersProps) {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recently Active
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Users with the latest activity
        </p>
      </div>

      {users.length === 0 ? (
        <EmptyState title="No recently active users" message="" />
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 dark:border-gray-800"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.first_name} ${user.last_name}`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                      {`${user.first_name} ${user.last_name}`
                        .trim()
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {user.first_name} {user.last_name}
                  </p>

                  <p className="truncate text-gray-500 text-theme-xs dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
