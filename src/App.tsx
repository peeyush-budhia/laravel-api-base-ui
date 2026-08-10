import { BrowserRouter as Router, Route, Routes } from 'react-router';

import { ScrollToTop } from './components/common/ScrollToTop';
import AppLayout from './layout/AppLayout';

import SignIn from './pages/AuthPages/SignIn';
import SignUp from './pages/AuthPages/SignUp';

import Home from './pages/Dashboard/Home';
import NotFound from './pages/OtherPage/NotFound';

import Users from './pages/Users/Users';
import Roles from './pages/Roles/Roles';
import Settings from './pages/Settings/Settings';
import UserProfiles from './pages/UserProfiles';

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Application Layout */}
        <Route element={<AppLayout />}>
          {/* Dashboard */}
          <Route index path="/" element={<Home />} />

          {/* Administration */}
          <Route path="/users" element={<Users />} />
          <Route path="/roles" element={<Roles />} />

          {/* Account */}
          <Route path="/profile" element={<UserProfiles />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Authentication */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
