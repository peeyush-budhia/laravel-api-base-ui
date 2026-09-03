import type { DashboardUserStatistics } from '../../types/dashboard';
import Badge from '../ui/badge/Badge';

interface UserStatusCardProps {
  statistics: DashboardUserStatistics;
}

const statusConfig = {
  active: {
    label: 'Active',
    color: 'success' as const,
  },
  inactive: {
    label: 'Inactive',
    color: 'warning' as const,
  },
  suspended: {
    label: 'Suspended',
    color: 'error' as const,
  },
};

export default function UserStatusCard({ statistics }: UserStatusCardProps) {
  const total = Object.values(statistics.by_status).reduce(
    (sum, value) => sum + value,
    0,
  );

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Users by Status
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Current user distribution
        </p>
      </div>

      <div className="space-y-5">
        {Object.entries(statistics.by_status).map(([status, count]) => {
          const config = statusConfig[status as keyof typeof statusConfig];

          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={status}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                    {config?.label ?? status}
                  </span>

                  {config && (
                    <Badge size="sm" color={config.color}>
                      {count}
                    </Badge>
                  )}
                </div>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {percentage}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
