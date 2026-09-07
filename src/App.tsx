import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';

import { ScrollToTop } from './components/common/ScrollToTop';
import AppLayout from './layout/AppLayout';
import GuestNotFound from './pages/others/GuestNotFound';
import ProtectedNotFound from './pages/others/ProtectedNotFound';
import LoadingState from './components/common/LoadingState';

import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import PermissionRoute from './routes/PermissionRoute';

import { permissions } from './auth/permissions';
import { routes } from './routes/routes';

const SignIn = lazy(() => import('./pages/auth/SignIn'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const ActivateAccount = lazy(() => import('./pages/auth/ActivateAccount'));
const Home = lazy(() => import('./pages/dashboard/Home'));
const Unauthorized = lazy(() => import('./pages/errors/Unauthorized'));
const UserProfile = lazy(() => import('./pages/profile/Profile'));
const Users = lazy(() => import('./pages/users/Users'));
const UserCreate = lazy(() => import('./pages/users/UserCreate'));
const UserDetails = lazy(() => import('./pages/users/UserDetails'));
const UserEdit = lazy(() => import('./pages/users/UserEdit'));
const Roles = lazy(() => import('./pages/roles/Roles'));
const RoleDetails = lazy(() => import('./pages/roles/RoleDetails'));
const RoleCreate = lazy(() => import('./pages/roles/RoleCreate'));
const RoleEdit = lazy(() => import('./pages/roles/RoleEdit'));
const AuditLogs = lazy(() => import('./pages/audit-logs/AuditLogs'));
const AuditLogDetails = lazy(
  () => import('./pages/audit-logs/AuditLogDetails'),
);

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Suspense fallback={<LoadingState message="Loading page..." />}>
        <Routes>
          {/* Guest Routes */}
          <Route element={<GuestRoute />}>
            <Route path="/" element={<SignIn />} />

            <Route path={routes.auth.signIn} element={<SignIn />} />

            <Route
              path={routes.auth.forgotPassword}
              element={<ForgotPassword />}
            />

            <Route
              path={routes.auth.resetPassword}
              element={<ResetPassword />}
            />

            <Route
              path={routes.auth.activateAccount}
              element={<ActivateAccount />}
            />
          </Route>

          {/* Authenticated Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Application */}
            <Route element={<AppLayout />}>
              <Route
                element={
                  <PermissionRoute permission={permissions.dashboard.view} />
                }
              >
                <Route path={routes.dashboard.home} element={<Home />} />
              </Route>

              <Route
                element={
                  <PermissionRoute permission={permissions.auditLogs.view} />
                }
              >
                <Route path={routes.auditLogs.index} element={<AuditLogs />} />

                <Route
                  path={routes.auditLogs.showPattern}
                  element={<AuditLogDetails />}
                />
              </Route>

              {/* Profile */}
              <Route path={routes.profile.index} element={<UserProfile />} />

              {/* Users */}
              <Route
                element={
                  <PermissionRoute permission={permissions.users.view} />
                }
              >
                <Route path={routes.users.index} element={<Users />} />

                <Route
                  path={routes.users.showPattern}
                  element={<UserDetails />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute permission={permissions.users.create} />
                }
              >
                <Route path={routes.users.create} element={<UserCreate />} />
              </Route>

              <Route
                element={
                  <PermissionRoute permission={permissions.users.update} />
                }
              >
                <Route path={routes.users.editPattern} element={<UserEdit />} />
              </Route>

              {/* Roles */}
              <Route
                element={
                  <PermissionRoute permission={permissions.roles.view} />
                }
              >
                <Route path={routes.roles.index} element={<Roles />} />

                <Route
                  path={routes.roles.showPattern}
                  element={<RoleDetails />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute permission={permissions.roles.create} />
                }
              >
                <Route path={routes.roles.create} element={<RoleCreate />} />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={[
                      permissions.roles.update,
                      permissions.roles.managePermissions,
                    ]}
                  />
                }
              >
                <Route path={routes.roles.editPattern} element={<RoleEdit />} />
              </Route>

              <Route
                path={routes.error.unauthorized}
                element={<Unauthorized />}
              />
              <Route path="*" element={<ProtectedNotFound />} />
            </Route>
          </Route>

          {/* Guest 404 */}
          <Route path="*" element={<GuestNotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
