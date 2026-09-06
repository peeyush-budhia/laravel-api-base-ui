import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import PermissionRoute from '../../routes/PermissionRoute';
import { permissions, type Permission } from '../../auth/permissions';
import { routes } from '../../routes/routes';
import type { AuthUser } from '../../auth/types';

const mockCan = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('../../auth/useAuthorization', () => ({
  useAuthorization: () => ({
    can: mockCan,
    canAny: vi.fn(),
    canAll: vi.fn(),
  }),
}));

vi.mock('../../auth/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

function createUser(userPermissions: string[] = []): AuthUser {
  return {
    id: 'user-1',
    first_name: 'Test',
    last_name: 'User',
    full_name: 'Test User',
    email: 'test@example.com',
    avatar: null,
    role: 'admin',
    permissions: userPermissions,
    status: 'active',
    email_verified_at: null,
    last_login_at: null,
    created_at: null,
    updated_at: null,
    deleted_at: null,
  };
}

describe('PermissionRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderPermissionRoute(
    permission: Permission,
    allowed: boolean,
    user: AuthUser = createUser(),
  ) {
    mockCan.mockReturnValue(allowed);
    mockUseAuth.mockReturnValue({
      user,
      isLoading: false,
    });

    return render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<PermissionRoute permission={permission} />}>
            <Route path="/protected" element={<div>Protected Page</div>} />
          </Route>

          <Route path={routes.users.index} element={<div>Users Page</div>} />
          <Route
            path={routes.auditLogs.index}
            element={<div>Audit Logs Page</div>}
          />
          <Route
            path={routes.profile.index}
            element={<div>Profile Page</div>}
          />

          <Route
            path={routes.error.unauthorized}
            element={<div>Unauthorized Page</div>}
          />
        </Routes>
      </MemoryRouter>,
    );
  }

  it('renders the protected route when permission is granted', () => {
    renderPermissionRoute(permissions.dashboard.view, true);

    expect(screen.getByText('Protected Page')).toBeInTheDocument();

    expect(screen.queryByText('Unauthorized Page')).not.toBeInTheDocument();
  });

  it('redirects to profile when dashboard permission is denied', async () => {
    renderPermissionRoute(permissions.dashboard.view, false);

    expect(await screen.findByText('Profile Page')).toBeInTheDocument();

    expect(screen.queryByText('Protected Page')).not.toBeInTheDocument();
  });

  it('redirects dashboard users to the first allowed route', async () => {
    const user = createUser([permissions.users.view]);

    renderPermissionRoute(permissions.dashboard.view, false, user);

    expect(await screen.findByText('Users Page')).toBeInTheDocument();
    expect(screen.queryByText('Unauthorized Page')).not.toBeInTheDocument();
  });

  it('redirects audit log users to the audit log index when that is the only allowed route', async () => {
    const user = createUser([permissions.auditLogs.view]);

    renderPermissionRoute(permissions.dashboard.view, false, user);

    expect(await screen.findByText('Audit Logs Page')).toBeInTheDocument();
    expect(screen.queryByText('Unauthorized Page')).not.toBeInTheDocument();
  });

  it('falls back to profile when dashboard is denied and no other route is allowed', async () => {
    renderPermissionRoute(permissions.dashboard.view, false, createUser([]));

    expect(await screen.findByText('Profile Page')).toBeInTheDocument();
    expect(screen.queryByText('Unauthorized Page')).not.toBeInTheDocument();
  });

  it('checks the requested permission', () => {
    renderPermissionRoute(permissions.dashboard.view, true);

    expect(mockCan).toHaveBeenCalledTimes(1);

    expect(mockCan).toHaveBeenCalledWith(permissions.dashboard.view);
  });
});
