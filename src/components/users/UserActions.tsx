import ActionsDropdown, { type ActionItem } from '../common/ActionsDropdown';

import { routes } from '../../routes/routes';
import type { User } from '../../types/user';
import { SUPER_ADMIN_ROLE } from '../../constants/roles';

interface UserActionsProps {
  user: User;
  canView: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  onDelete: (user: User) => void;
  onRestore: (user: User) => void;
  onForceDelete: (user: User) => void;
}

export default function UserActions({
  user,
  canView,
  canUpdate,
  canDelete,
  onDelete,
  onRestore,
  onForceDelete,
}: UserActionsProps) {
  const isSuperAdmin = user.role === SUPER_ADMIN_ROLE;

  if (isSuperAdmin) {
    return null;
  }

  const items: ActionItem[] = [
    ...(canView && !user.deleted_at
      ? [
          {
            label: 'View',
            to: routes.users.show(user.id),
          },
        ]
      : []),

    ...(canUpdate && !user.deleted_at
      ? [
          {
            label: 'Edit',
            to: routes.users.edit(user.id),
          },
        ]
      : []),

    ...(canDelete && !user.deleted_at
      ? [
          {
            label: 'Delete',
            onClick: () => onDelete(user),
            variant: 'danger' as const,
          },
        ]
      : []),

    ...(canDelete && user.deleted_at
      ? [
          {
            label: 'Restore',
            onClick: () => onRestore(user),
          },
          {
            label: 'Permanently Delete',
            onClick: () => onForceDelete(user),
            variant: 'danger' as const,
          },
        ]
      : []),
  ];

  if (items.length === 0) {
    return null;
  }

  return (
    <ActionsDropdown
      ariaLabel={`Actions for ${user.full_name}`}
      items={items}
    />
  );
}
