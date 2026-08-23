import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuth } from '../auth/useAuth';
import type { Permission } from '../auth/permissions';
import { routes } from './routes';

interface PermissionRouteProps {
  permission: Permission;
}

export default function PermissionRoute({ permission }: PermissionRouteProps) {
  const { user, isLoading, can } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <Navigate
        to={routes.auth.signIn}
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  if (
    user.must_change_password &&
    location.pathname !== routes.auth.changePassword
  ) {
    return (
      <Navigate
        to={routes.auth.changePassword}
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  if (!can(permission)) {
    return <Navigate to={routes.dashboard.home} replace />;
  }

  return <Outlet />;
}
