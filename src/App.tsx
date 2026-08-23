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

import UserProfile from './pages/profile/Profile';

import Users from './pages/users/Users';
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
import PermissionRoute from './routes/PermissionRoute';

import { permissions } from './auth/permissions';
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
            {/* Dashboard */}
            <Route path={routes.dashboard.home} element={<Home />} />

            {/* Profile */}
            <Route path={routes.profile.index} element={<UserProfile />} />

            {/* Settings */}
            <Route path={routes.settings.index} element={<Settings />} />

            {/* Users */}
            <Route
              element={<PermissionRoute permission={permissions.usersView} />}
            >
              <Route path={routes.users.index} element={<Users />} />

              <Route
                path={routes.users.showPattern}
                element={<UserDetails />}
              />
            </Route>

            <Route
              element={<PermissionRoute permission={permissions.usersCreate} />}
            >
              <Route path={routes.users.create} element={<UserCreate />} />
            </Route>

            <Route
              element={<PermissionRoute permission={permissions.usersUpdate} />}
            >
              <Route path={routes.users.editPattern} element={<UserEdit />} />
            </Route>

            {/* Roles */}
            <Route
              element={<PermissionRoute permission={permissions.rolesView} />}
            >
              <Route path={routes.roles.index} element={<Roles />} />

              <Route
                path={routes.roles.showPattern}
                element={<RoleDetails />}
              />
            </Route>

            <Route
              element={<PermissionRoute permission={permissions.rolesCreate} />}
            >
              <Route path={routes.roles.create} element={<RoleCreate />} />
            </Route>

            <Route
              element={<PermissionRoute permission={permissions.rolesUpdate} />}
            >
              <Route path={routes.roles.editPattern} element={<RoleEdit />} />
            </Route>

            {/* Protected 404 */}
            <Route path="*" element={<ProtectedNotFound />} />
          </Route>
        </Route>

        {/* Guest 404 */}
        <Route path="*" element={<GuestNotFound />} />
      </Routes>
    </Router>
  );
}
