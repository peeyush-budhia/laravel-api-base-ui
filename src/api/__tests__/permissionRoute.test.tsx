import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import PermissionRoute from '../../routes/PermissionRoute';
import { permissions, type Permission } from '../../auth/permissions';
import { routes } from '../../routes/routes';

const mockCan = vi.fn();

vi.mock('../../auth/useAuthorization', () => ({
  useAuthorization: () => ({
    can: mockCan,
    canAny: vi.fn(),
    canAll: vi.fn(),
  }),
}));

describe('PermissionRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderPermissionRoute(permission: Permission, allowed: boolean) {
    mockCan.mockReturnValue(allowed);

    return render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<PermissionRoute permission={permission} />}>
            <Route path="/protected" element={<div>Protected Page</div>} />
          </Route>

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

  it('redirects to unauthorized when permission is denied', () => {
    renderPermissionRoute(permissions.dashboard.view, false);

    expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();

    expect(screen.queryByText('Protected Page')).not.toBeInTheDocument();
  });

  it('checks the requested permission', () => {
    renderPermissionRoute(permissions.dashboard.view, true);

    expect(mockCan).toHaveBeenCalledTimes(1);

    expect(mockCan).toHaveBeenCalledWith(permissions.dashboard.view);
  });
});
