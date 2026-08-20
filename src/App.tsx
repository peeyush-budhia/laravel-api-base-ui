import { BrowserRouter as Router, Route, Routes } from 'react-router';

import { ScrollToTop } from './components/common/ScrollToTop';
import AppLayout from './layout/AppLayout';

import SignIn from './pages/auth/SignIn';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ChangePassword from './pages/auth/ChangePassword';

import Home from './pages/dashboard/Home';
import GuestNotFound from './pages/others/GuestNotFound';
import ProtectedNotFound from './pages/others/ProtectedNotFound';

import Users from './pages/users/Users';
import UserProfiles from './pages/UserProfiles';
import UserCreate from './pages/users/UserCreate';
import UserDetails from './pages/users/UserDetails';
import UserEdit from './pages/users/UserEdit';

import Roles from './pages/roles/Roles';
import RoleDetails from './pages/roles/RoleDetails';
import RoleCreate from './pages/roles/RoleCreate';
import RoleEdit from './pages/roles/RoleEdit';

import Settings from './pages/settings/Settings';

import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';

import { routes } from './routes/routes';

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Guest Routes */}
        <Route element={<GuestRoute />}>
          <Route path={routes.auth.signIn} element={<SignIn />} />

          <Route
            path={routes.auth.forgotPassword}
            element={<ForgotPassword />}
          />

          <Route path={routes.auth.resetPassword} element={<ResetPassword />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path={routes.auth.changePassword}
            element={<ChangePassword />}
          />

          <Route element={<AppLayout />}>
            <Route path={routes.dashboard.home} element={<Home />} />

            <Route path={routes.users.index} element={<Users />} />
            <Route path={routes.users.showPattern} element={<UserDetails />} />
            <Route path={routes.users.create} element={<UserCreate />} />
            <Route path={routes.users.editPattern} element={<UserEdit />} />

            <Route path={routes.roles.index} element={<Roles />} />
            <Route path={routes.roles.showPattern} element={<RoleDetails />} />
            <Route path={routes.roles.create} element={<RoleCreate />} />
            <Route path={routes.roles.editPattern} element={<RoleEdit />} />

            <Route path={routes.settings.index} element={<Settings />} />

            <Route path={routes.profile.index} element={<UserProfiles />} />

            <Route path="*" element={<ProtectedNotFound />} />
          </Route>
        </Route>

        {/* Guest 404 */}
        <Route path="*" element={<GuestNotFound />} />
      </Routes>
    </Router>
  );
}
