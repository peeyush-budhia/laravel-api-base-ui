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
   * Users with a temporary/generated password must change it
   * before accessing the rest of the application.
   *
   * Allow the change-password route itself to prevent a redirect loop.
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
