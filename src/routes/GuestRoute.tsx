import { Navigate, Outlet } from 'react-router';

import { useAuth } from '../auth/useAuth';
import { routes } from './routes';

export default function GuestRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user) {
    return <Navigate to={routes.dashboard.home} replace />;
  }

  return <Outlet />;
}
