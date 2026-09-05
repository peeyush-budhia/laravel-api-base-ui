import type { ReactNode } from 'react';
import { BoxIconLine, FileIcon, GroupIcon } from '../../icons';
import type { DashboardSummary } from '../../types/dashboard';

interface DashboardMetricsProps {
  summary: DashboardSummary;
}

interface Metric {
  label: string;
  value: number;
  icon: ReactNode;
  accentClassName: string;
}

export default function DashboardMetrics({ summary }: DashboardMetricsProps) {
  const metrics: Metric[] = [
    {
      label: 'Total Users',
      value: summary.users.total,
      accentClassName:
        'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
      icon: <GroupIcon className="size-6" />,
    },
    {
      label: 'Roles',
      value: summary.roles.total,
      accentClassName:
        'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400',
      icon: <GroupIcon className="size-6" />,
    },
    {
      label: 'Permissions',
      value: summary.permissions.total,
      accentClassName:
        'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
      icon: <FileIcon className="size-6" />,
    },
    {
      label: 'Audit Logs',
      value: summary.audit_logs.total,
      accentClassName:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
      icon: <BoxIconLine className="size-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="h-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${metric.accentClassName}`}
          >
            {metric.icon}
          </div>

          <div className="mt-5">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {metric.label}
            </span>

            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metric.value.toLocaleString()}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
}
