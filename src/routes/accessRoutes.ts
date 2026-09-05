import { permissions } from '../auth/permissions';
import type { AuthUser } from '../auth/types';
import { routes } from './routes';

export function getDefaultAllowedRoute(user: AuthUser | null): string {
  if (!user) {
    return routes.auth.signIn;
  }

  const userPermissions = new Set(user.permissions);

  if (userPermissions.has(permissions.users.view)) {
    return routes.users.index;
  }

  if (userPermissions.has(permissions.users.create)) {
    return routes.users.create;
  }

  if (userPermissions.has(permissions.roles.view)) {
    return routes.roles.index;
  }

  if (userPermissions.has(permissions.roles.create)) {
    return routes.roles.create;
  }

  if (userPermissions.has(permissions.auditLogs.view)) {
    return routes.auditLogs.index;
  }

  return routes.profile.index;
}
