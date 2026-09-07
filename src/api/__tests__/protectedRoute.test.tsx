import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

import ProtectedRoute from '../../routes/ProtectedRoute';
import { routes } from '../../routes/routes';
import type { AuthUser } from '../../auth/types';

const mockUseAuth = vi.fn();

vi.mock('../../auth/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

function createUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: 'user-1',
    first_name: 'Test',
    last_name: 'User',
    full_name: 'Test User',
    email: 'test@example.com',
    avatar: null,
    role: 'admin',
    permissions: [],
    status: 'active',
    email_verified_at: null,
    last_login_at: null,
    created_at: null,
    updated_at: null,
    deleted_at: null,
    ...overrides,
  };
}

function renderProtectedRoute(
  initialPath: string,
  user: AuthUser | null,
  isLoading = false,
) {
  mockUseAuth.mockReturnValue({
    user,
    isLoading,
  });

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            path={routes.dashboard.home}
            element={<div>Dashboard Page</div>}
          />

          <Route path={routes.users.index} element={<div>Users Page</div>} />

          <Route path={routes.roles.index} element={<div>Roles Page</div>} />

          <Route
            path={routes.auditLogs.index}
            element={<div>Audit Logs Page</div>}
          />
        </Route>

        <Route path={routes.auth.signIn} element={<div>Sign In Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing while authentication is loading', () => {
    const { container } = renderProtectedRoute(
      routes.dashboard.home,
      null,
      true,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('redirects unauthenticated users to sign in', () => {
    renderProtectedRoute(routes.dashboard.home, null);

    expect(screen.getByText('Sign In Page')).toBeInTheDocument();
  });

  it('allows authenticated users to access protected routes', () => {
    const user = createUser();

    renderProtectedRoute(routes.dashboard.home, user);

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });
});
