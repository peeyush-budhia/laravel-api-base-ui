import { Link } from 'react-router';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';

import Badge from '../ui/badge/Badge';

import {
  userStatusColors,
  userStatusLabels,
  type User,
} from '../../types/user';

import { routes } from '../../routes/routes';

import UserAvatar from './UserAvatar';
import UserActions from './UserActions';

import { formatDateTime } from '../../utils/dateTimeUtils';
interface UserTableProps {
  users: User[];
  isLoading: boolean;

  sort: string;
  direction: 'asc' | 'desc';

  trashed: 'without' | 'with' | 'only';

  canView: boolean;
  canUpdate: boolean;
  canDelete: boolean;

  onSort: (field: string) => void;

  onDelete: (user: User) => void;
  onRestore: (user: User) => void;
  onForceDelete: (user: User) => void;
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <TableRow key={`loading-row-${rowIndex}`}>
          {Array.from({ length: 6 }).map((__, cellIndex) => (
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

export default function UserTable({
  users,
  isLoading,
  sort,
  direction,
  trashed,
  canView,
  canUpdate,
  canDelete,
  onSort,
  onDelete,
  onRestore,
  onForceDelete,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="border-y border-gray-100 dark:border-gray-800">
          <TableRow>
            <SortableHeader
              field="first_name"
              label="User"
              sort={sort}
              direction={direction}
              onSort={onSort}
              className="min-w-[280px]"
            />

            <TableCell
              isHeader
              className="px-5 py-4 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Role
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
              Email Verified
            </TableCell>

            <TableCell
              isHeader
              className="px-5 py-4 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {trashed === 'only' ? 'Deleted At' : 'Last Login'}
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
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} />

                    <div className="min-w-0">
                      <Link
                        to={routes.users.show(user.id)}
                        className="truncate text-sm font-medium text-gray-800 hover:text-brand-500 dark:text-white/90 dark:hover:text-brand-400"
                      >
                        {user.full_name}
                      </Link>

                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {user.role ? (
                    <Badge size="sm" color="info">
                      {user.role}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>

                <TableCell className="px-5 py-4">
                  {user.deleted_at ? (
                    <Badge size="sm" color="error">
                      Deleted
                    </Badge>
                  ) : (
                    <Badge size="sm" color={userStatusColors[user.status]}>
                      {userStatusLabels[user.status]}
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {user.email_verified_at ? 'Verified' : 'Not verified'}
                </TableCell>

                <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {trashed === 'only'
                    ? formatDateTime(user.deleted_at)
                    : formatDateTime(user.last_login_at)}
                </TableCell>

                <TableCell className="px-5 py-4 text-end">
                  <UserActions
                    user={user}
                    canView={canView}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                    onDelete={onDelete}
                    onRestore={onRestore}
                    onForceDelete={onForceDelete}
                  />
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && users.length === 0 && (
            <TableRow>
              <TableCell className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
