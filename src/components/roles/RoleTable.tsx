import { Link } from 'react-router';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';

import Badge from '../ui/badge/Badge';

import type { Role } from '../../types/role';

import { SUPER_ADMIN_ROLE } from '../../constants/roles';
import { routes } from '../../routes/routes';

import RoleActions from './RoleActions';
import { formatDateTime } from '../../utils/dateTimeUtils';

interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;

  sort: string;
  direction: 'asc' | 'desc';

  canView: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManagePermissions: boolean;

  onSort: (field: string) => void;
  onDelete: (role: Role) => void;
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <TableRow key={`loading-row-${rowIndex}`}>
          {Array.from({ length: 5 }).map((__, cellIndex) => (
            <TableCell key={`loading-cell-${cellIndex}`} className="px-5 py-4">
              <div className="h-5 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

interface SortableHeaderProps {
  field: string;
  label: string;
  sort: string;
  direction: 'asc' | 'desc';
  onSort: (field: string) => void;
  className?: string;
}

function SortableHeader({
  field,
  label,
  sort,
  direction,
  onSort,
  className = '',
}: SortableHeaderProps) {
  return (
    <TableCell
      isHeader
      className={`px-5 py-4 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 ${className}`.trim()}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1"
      >
        {label}

        {sort === field && <span>{direction === 'asc' ? '↑' : '↓'}</span>}
      </button>
    </TableCell>
  );
}

export default function RoleTable({
  roles,
  isLoading,
  sort,
  direction,
  canView,
  canUpdate,
  canManagePermissions,
  canDelete,

  onSort,
  onDelete,
}: RoleTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="border-y border-gray-100 dark:border-gray-800">
          <TableRow>
            <SortableHeader
              field="name"
              label="Role"
              sort={sort}
              direction={direction}
              onSort={onSort}
              className="min-w-[280px]"
            />

            <TableCell
              isHeader
              className="px-5 py-4 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Guard
            </TableCell>

            <TableCell
              isHeader
              className="px-5 py-4 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Status
            </TableCell>

            <TableCell
              isHeader
              className="px-5 py-4 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Created At
            </TableCell>

            <TableCell
              isHeader
              className="px-5 py-4 text-end text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
          {isLoading && <LoadingRows />}

          {!isLoading &&
            roles.map((role) => {
              const isSuperAdmin = role.name === SUPER_ADMIN_ROLE;

              return (
                <TableRow key={role.id}>
                  <TableCell className="px-5 py-4">
                    <div className="min-w-0">
                      <Link
                        to={routes.roles.show(role.id)}
                        className="truncate text-sm font-medium text-gray-800 hover:text-brand-500 dark:text-white/90 dark:hover:text-brand-400"
                      >
                        {role.name}
                      </Link>

                      {isSuperAdmin && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Protected system role
                        </p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {role.guard_name}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    {isSuperAdmin ? (
                      <Badge size="sm" color="warning">
                        Protected
                      </Badge>
                    ) : (
                      <Badge size="sm" color="success">
                        Active
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDateTime(role.created_at)}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-end">
                    <RoleActions
                      role={role}
                      canView={canView}
                      canUpdate={canUpdate}
                      canDelete={canDelete}
                      canManagePermissions={canManagePermissions}
                      onDelete={onDelete}
                    />
                  </TableCell>
                </TableRow>
              );
            })}

          {!isLoading && roles.length === 0 && (
            <TableRow>
              <TableCell className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                No roles found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
