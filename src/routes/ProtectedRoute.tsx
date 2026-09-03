import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuth } from '../auth/useAuth';
import { routes } from './routes';

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();
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

  /*
   * Users who are required to change their password must not be
   * allowed to access the normal application until the password
   * has been changed.
   *
   * The change-password route itself must remain accessible.
   */
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

  return <Outlet />;
}
