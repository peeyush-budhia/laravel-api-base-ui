import type { AuditEvent } from '../../types/auditLog';
import type { DashboardAuditStatistics } from '../../types/dashboard';
import EmptyState from '../common/EmptyState';
import Badge from '../ui/badge/Badge';
import { semanticToneColors } from '../../types/semanticTone';

interface AuditEventCardProps {
  statistics: DashboardAuditStatistics;
}

export default function AuditEventCard({ statistics }: AuditEventCardProps) {
  const total = Object.values(statistics.by_event).reduce(
    (sum, value) => sum + (value ?? 0),
    0,
  );
  const eventCounts = Object.entries(statistics.by_event) as Array<
    [AuditEvent, number]
  >;

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Audit Activity
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {total.toLocaleString()} recorded events
        </p>
      </div>

      {Object.keys(statistics.by_event).length === 0 ? (
        <EmptyState title="No audit events recorded" message="" />
      ) : (
        <div className="space-y-4">
          {eventCounts.map(([event, count]) => (
            <div
              key={event}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-gray-800"
            >
              <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                {statistics.event_labels?.[event] ?? event.replaceAll('_', ' ')}
              </span>

              <Badge
                size="sm"
                color={
                  statistics.event_tones?.[event]
                    ? semanticToneColors[
                        statistics.event_tones[
                          event
                        ] as keyof typeof semanticToneColors
                      ]
                    : 'light'
                }
              >
                {count.toLocaleString()}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
