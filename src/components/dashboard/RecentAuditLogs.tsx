import { formatDateTime } from '../../utils/dateTimeUtils';
import type { DashboardAuditLog } from '../../types/dashboard';
import Badge from '../ui/badge/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import EmptyState from '../common/EmptyState';
import { auditEventColors } from '../../types/auditLog';

interface RecentAuditLogsProps {
  logs: DashboardAuditLog[];
}

export default function RecentAuditLogs({ logs }: RecentAuditLogsProps) {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent Audit Logs
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Latest system activity
        </p>
      </div>

      {logs.length === 0 ? (
        <EmptyState title="No audit logs found" message="" />
      ) : (
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Event
                </TableCell>

                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>

                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Resource
                </TableCell>

                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Date
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="py-3">
                    <Badge
                      size="sm"
                      color={
                        auditEventColors[
                          log.event as keyof typeof auditEventColors
                        ] ?? 'light'
                      }
                    >
                      <div className="capitalize">
                        {log.event.replaceAll('_', ' ')}
                      </div>
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {log.user
                          ? `${log.user.first_name} ${log.user.last_name}`.trim()
                          : 'System'}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {log.auditable_type.split('\\').pop() ?? 'Unknown'}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {log.auditable_type.split('\\').pop() ?? 'Unknown'}
                  </TableCell>

                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatDateTime(log.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
