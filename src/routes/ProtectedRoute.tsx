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

  return <Outlet />;
}
