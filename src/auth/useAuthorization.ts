import { useAuth } from './useAuth';
import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from './authorization';
import type { Permission } from './permissions';

export function useAuthorization() {
  const { user } = useAuth();

  return {
    can: (permission: Permission) => hasPermission(user, permission),

    canAny: (requiredPermissions: Permission[]) =>
      hasAnyPermission(user, requiredPermissions),

    canAll: (requiredPermissions: Permission[]) =>
      hasAllPermissions(user, requiredPermissions),
  };
}
