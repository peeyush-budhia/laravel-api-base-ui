import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

import GuestRoute from '../../routes/GuestRoute';
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

function renderGuestRoute(initialPath: string, user: AuthUser | null) {
  mockUseAuth.mockReturnValue({
    user,
    isLoading: false,
  });

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/" element={<div>Sign In Page</div>} />
          <Route path={routes.auth.signIn} element={<div>Sign In Page</div>} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path={routes.dashboard.home}
            element={<div>Dashboard Page</div>}
          />
        </Route>

        <Route
          path={routes.error.unauthorized}
          element={<div>Unauthorized Page</div>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('GuestRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign in on the root path for guests', () => {
    renderGuestRoute('/', null);

    expect(screen.getByText('Sign In Page')).toBeInTheDocument();
  });

  it('redirects authenticated users from root to dashboard', () => {
    const user = createUser();

    renderGuestRoute('/', user);

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });
});
