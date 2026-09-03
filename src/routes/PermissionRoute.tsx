import { Navigate, Outlet } from 'react-router';

import type { Permission } from '../auth/permissions';
import { routes } from './routes';
import { useAuthorization } from '../auth/useAuthorization';

interface PermissionRouteProps {
  permission: Permission;
}

export default function PermissionRoute({ permission }: PermissionRouteProps) {
  const { can } = useAuthorization();

  if (!can(permission)) {
    return <Navigate to={routes.error.unauthorized} replace />;
  }

  return <Outlet />;
}
