import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';

import Badge, { type BadgeColor } from '../ui/badge/Badge';

import { LoadingRows, SortableHeader } from '../common/Table';

import {
  type AuditEvent,
  type AuditLog,
  auditEventColors,
  auditEventLabels,
} from '../../types/auditLog';

import UserAvatar from '../users/UserAvatar';

import { formatDateTime } from '../../utils/dateTimeUtils';
import Button from '../ui/button/Button';

interface AuditLogTableProps {
  logs: AuditLog[];
  isLoading: boolean;

  sort: string;
  direction: 'asc' | 'desc';

  onSort: (field: string) => void;
  onView: (id: string) => void;
}

function getEventColor(event: string): BadgeColor {
  return auditEventColors[event as AuditEvent] ?? 'light';
}

function getEventLabel(event: string): string {
  return auditEventLabels[event as AuditEvent] ?? event;
}

function getResourceName(type: string): string {
  return type.split('\\').pop() ?? 'Unknown';
}

export default function AuditLogTable({
  logs,
  isLoading,
  sort,
  direction,
  onSort,
  onView,
}: AuditLogTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="border-y border-gray-100 dark:border-gray-800">
          <TableRow>
            <SortableHeader
              field="event"
              label="Event"
              sort={sort}
              direction={direction}
              onSort={onSort}
              className="min-w-[150px]"
            />

            <TableCell
              isHeader
              className="px-5 py-4 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              User
            </TableCell>

            <SortableHeader
              field="auditable_type"
              label="Resource"
              sort={sort}
              direction={direction}
              onSort={onSort}
            />

            <SortableHeader
              field="auditable_id"
              label="Resource ID"
              sort={sort}
              direction={direction}
              onSort={onSort}
              className="min-w-[220px]"
            />

            <SortableHeader
              field="created_at"
              label="Date"
              sort={sort}
              direction={direction}
              onSort={onSort}
            />

            <TableCell
              isHeader
              className="px-5 py-4 text-end text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
          {isLoading && <LoadingRows columns={6} />}

          {!isLoading &&
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="px-5 py-4">
                  <Badge size="sm" color={getEventColor(log.event)}>
                    {getEventLabel(log.event)}
                  </Badge>
                </TableCell>

                <TableCell className="px-5 py-4">
                  {log.user ? (
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        user={{
                          id: log.user.id,
                          first_name: log.user.first_name,
                          last_name: log.user.last_name,
                          full_name:
                            `${log.user.first_name} ${log.user.last_name}`.trim(),
                          email: log.user.email,
                          avatar: log.user.avatar,
                          role: null,
                          permissions: [],
                          status: 'active',
                          must_change_password: false,
                          email_verified_at: null,
                          last_login_at: null,
                          created_at: null,
                          updated_at: null,
                          deleted_at: null,
                        }}
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                          {`${log.user.first_name} ${log.user.last_name}`.trim()}
                        </p>

                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                          {log.user.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                          System
                        </p>
                      </div>
                    </div>
                  )}
                </TableCell>

                <TableCell className="px-5 py-4">
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {getResourceName(log.auditable_type)}
                  </span>
                </TableCell>

                <TableCell className="px-5 py-4">
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                    {log.auditable_id}
                  </span>
                </TableCell>

                <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDateTime(log.created_at)}
                </TableCell>

                <TableCell className="px-5 py-4 text-end">
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => onView(log.id)}
                    className="text-sm font-medium text-brand-50 hover:text-brand-100 dark:text-brand-50 dark:hover:text-brand-100"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
