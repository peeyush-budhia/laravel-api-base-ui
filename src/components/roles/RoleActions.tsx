import ActionsDropdown, { type ActionItem } from '../common/ActionsDropdown';

import { routes } from '../../routes/routes';
import type { Role } from '../../types/role';
import { SUPER_ADMIN_ROLE } from '../../constants/roles';

interface RoleActionsProps {
  role: Role;
  canView: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManagePermissions: boolean;
  onDelete: (role: Role) => void;
}

export default function RoleActions({
  role,
  canView,
  canUpdate,
  canDelete,
  onDelete,
}: RoleActionsProps) {
  const isSuperAdmin = role.name === SUPER_ADMIN_ROLE;

  const items: ActionItem[] = [
    ...(canView
      ? [
          {
            label: 'View',
            to: routes.roles.show(role.id),
          },
        ]
      : []),

    ...(canUpdate && !isSuperAdmin
      ? [
          {
            label: 'Edit',
            to: routes.roles.edit(role.id),
          },
        ]
      : []),

    ...(canDelete && !isSuperAdmin
      ? [
          {
            label: 'Delete',
            onClick: () => onDelete(role),
            variant: 'danger' as const,
          },
        ]
      : []),
  ];

  if (items.length === 0) {
    return null;
  }

  return (
    <ActionsDropdown ariaLabel={`Actions for ${role.name}`} items={items} />
  );
}
