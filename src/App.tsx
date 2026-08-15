import { BrowserRouter as Router, Route, Routes } from 'react-router';

import { ScrollToTop } from './components/common/ScrollToTop';
import AppLayout from './layout/AppLayout';

import SignIn from './pages/AuthPages/SignIn';
import SignUp from './pages/AuthPages/SignUp';
import ForgotPassword from './pages/AuthPages/ForgotPassword';
import ResetPassword from './pages/AuthPages/ResetPassword';

import Home from './pages/Dashboard/Home';
import GuestNotFound from './pages/OtherPage/GuestNotFound';
import ProtectedNotFound from './pages/OtherPage/ProtectedNotFound';

import Users from './pages/Users/Users';
import Roles from './pages/Roles/Roles';
import Settings from './pages/Settings/Settings';
import UserProfiles from './pages/UserProfiles';

import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';

import { routes } from './routes/routes';
import UserDetails from './pages/Users/UserDetails';

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Guest Routes */}
        <Route element={<GuestRoute />}>
          <Route path={routes.auth.signIn} element={<SignIn />} />

          <Route path={routes.auth.signUp} element={<SignUp />} />

          <Route
            path={routes.auth.forgotPassword}
            element={<ForgotPassword />}
          />

          <Route path={routes.auth.resetPassword} element={<ResetPassword />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path={routes.dashboard.home} element={<Home />} />

            <Route path={routes.users.index} element={<Users />} />
            <Route path={routes.users.showPattern} element={<UserDetails />} />

            <Route path={routes.roles.index} element={<Roles />} />

            <Route path={routes.settings.index} element={<Settings />} />

            <Route path={routes.profile.index} element={<UserProfiles />} />

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
