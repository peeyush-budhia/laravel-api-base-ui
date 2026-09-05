import { Navigate, Outlet } from 'react-router';

import type { Permission } from '../auth/permissions';
import { useAuthorization } from '../auth/useAuthorization';
import { useAuth } from '../auth/useAuth';
import { getDefaultAllowedRoute } from './accessRoutes';

interface PermissionRouteProps {
  permission: Permission;
}

export default function PermissionRoute({ permission }: PermissionRouteProps) {
  const { can } = useAuthorization();
  const { user } = useAuth();

  if (!can(permission)) {
    return <Navigate to={getDefaultAllowedRoute(user)} replace />;
  }

  return <Outlet />;
}
