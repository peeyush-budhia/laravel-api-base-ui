import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';

import Badge from '../ui/badge/Badge';

import { LoadingRows, SortableHeader } from '../common/Table';

import type { AuditLog } from '../../types/auditLog';
import { semanticToneColors } from '../../types/semanticTone';

import { formatDateTime } from '../../utils/dateTimeUtils';
import Button from '../ui/button/Button';
import { Link } from 'react-router';
import { routes } from '../../routes/routes';
import AuditLogUserDisplay from './AuditLogUserDisplay';
interface AuditLogTableProps {
  logs: AuditLog[];
  isLoading: boolean;

  sort: string;
  direction: 'asc' | 'desc';

  onSort: (field: string) => void;
  onView: (id: string) => void;
}

function getEventLabel(event: string, label?: string | null): string {
  if (label) {
    return label;
  }

  return event
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
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
                  <Link
                    to={routes.auditLogs.show(log.id)}
                    className="inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                    aria-label={`View details for ${getEventLabel(log.event, log.event_label)} audit log`}
                  >
                    <Badge
                      size="sm"
                      color={
                        log.event_tone
                          ? semanticToneColors[log.event_tone]
                          : 'light'
                      }
                    >
                      {getEventLabel(log.event, log.event_label)}
                    </Badge>
                  </Link>
                </TableCell>

                <TableCell className="px-5 py-4">
                  <AuditLogUserDisplay user={log.user} />
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
                    className="px-3 py-2 text-xs font-medium leading-none text-brand-50 hover:text-brand-100 dark:text-brand-50 dark:hover:text-brand-100"
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
