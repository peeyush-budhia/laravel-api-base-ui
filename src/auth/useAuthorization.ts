import { useCallback } from 'react';

import { useAuth } from './useAuth';
import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from './authorization';

import type { Permission } from './permissions';

export function useAuthorization() {
  const { user } = useAuth();

  const can = useCallback(
    (permission: Permission): boolean => {
      return hasPermission(user, permission);
    },
    [user],
  );

  const canAny = useCallback(
    (requiredPermissions: Permission[]): boolean => {
      return hasAnyPermission(user, requiredPermissions);
    },
    [user],
  );

  const canAll = useCallback(
    (requiredPermissions: Permission[]): boolean => {
      return hasAllPermissions(user, requiredPermissions);
    },
    [user],
  );

  return {
    can,
    canAny,
    canAll,
  };
}
