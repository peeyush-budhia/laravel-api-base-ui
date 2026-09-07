import { Navigate, Outlet } from 'react-router';

import type { Permission } from '../auth/permissions';
import { useAuthorization } from '../auth/useAuthorization';
import { useAuth } from '../auth/useAuth';
import { getDefaultAllowedRoute } from './accessRoutes';

interface PermissionRouteProps {
  permission: Permission | Permission[];
}

export default function PermissionRoute({ permission }: PermissionRouteProps) {
  const { can, canAny } = useAuthorization();
  const { user } = useAuth();

  const allowed = Array.isArray(permission)
    ? canAny(permission)
    : can(permission);

  if (!allowed) {
    return <Navigate to={getDefaultAllowedRoute(user)} replace />;
  }

  return <Outlet />;
}
