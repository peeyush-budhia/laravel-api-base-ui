import { Link } from 'react-router';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';

import Badge from '../ui/badge/Badge';

import { LoadingRows, SortableHeader } from '../common/Table';

import type { Role } from '../../types/role';

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

export default function RoleTable({
  roles,
  isLoading,
  sort,
  direction,
  canView,
  canUpdate,
  canDelete,
  canManagePermissions,
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
              className="min-w-[240px]"
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
              Created
            </TableCell>

            <TableCell
              isHeader
              className="px-5 py-4 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Updated
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
          {isLoading && <LoadingRows columns={5} />}

          {!isLoading &&
            roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="px-5 py-4">
                  <Link
                    to={routes.roles.show(role.id)}
                    className="text-sm font-medium text-gray-800 hover:text-brand-500 dark:text-white/90 dark:hover:text-brand-400"
                  >
                    {role.name}
                  </Link>
                </TableCell>

                <TableCell className="px-5 py-4">
                  <Badge size="sm" color="info">
                    {role.guard_name}
                  </Badge>
                </TableCell>

                <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDateTime(role.created_at)}
                </TableCell>

                <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDateTime(role.updated_at)}
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
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
