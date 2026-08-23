import type { AuthUser } from './types';
import type { Permission } from './permissions';

export function hasPermission(
  user: AuthUser | null,
  permission: Permission,
): boolean {
  if (!user) {
    return false;
  }

  return user.permissions.includes(permission);
}

export function hasAnyPermission(
  user: AuthUser | null,
  requiredPermissions: Permission[],
): boolean {
  if (!user) {
    return false;
  }

  return requiredPermissions.some((permission) =>
    user.permissions.includes(permission),
  );
}

export function hasAllPermissions(
  user: AuthUser | null,
  requiredPermissions: Permission[],
): boolean {
  if (!user) {
    return false;
  }

  return requiredPermissions.every((permission) =>
    user.permissions.includes(permission),
  );
}
