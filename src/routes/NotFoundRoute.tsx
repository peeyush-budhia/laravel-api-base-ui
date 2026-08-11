import { useAuth } from '../auth/useAuth';

import GuestNotFound from '../pages/OtherPage/GuestNotFound';
import ProtectedNotFound from '../pages/OtherPage/ProtectedNotFound';

export default function NotFoundRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user) {
    return <ProtectedNotFound />;
  }

  return <GuestNotFound />;
}
