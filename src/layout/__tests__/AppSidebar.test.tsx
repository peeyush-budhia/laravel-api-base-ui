import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import AppSidebar from '../AppSidebar';
import { permissions } from '../../auth/permissions';

const mockUseSidebar = vi.fn();
const mockUseAuthorization = vi.fn();

vi.mock('../../context/SidebarContext', () => ({
  useSidebar: () => mockUseSidebar(),
}));

vi.mock('../../auth/useAuthorization', () => ({
  useAuthorization: () => mockUseAuthorization(),
}));

vi.mock('../../icons', () => {
  const Icon = () => <svg aria-hidden="true" />;

  return {
    ChevronDownIcon: Icon,
    GridIcon: Icon,
    MoreDotIcon: Icon,
    BoxCubeIcon: Icon,
    UserCircleIcon: Icon,
    ListIcon: Icon,
    GroupIcon: Icon,
    ShieldIcon: Icon,
  };
});

function renderSidebar() {
  return render(
    <MemoryRouter>
      <AppSidebar />
    </MemoryRouter>,
  );
}

describe('AppSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSidebar.mockReturnValue({
      isExpanded: true,
      isMobileOpen: false,
      isHovered: false,
      setIsHovered: vi.fn(),
    });
  });

  it('renders the dashboard menu only when the user can view the dashboard', () => {
    mockUseAuthorization.mockReturnValue({
      canAny: (requiredPermissions: string[]) =>
        requiredPermissions.includes(permissions.dashboard.view),
      can: vi.fn(),
      canAll: vi.fn(),
    });

    renderSidebar();

    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Administration')).not.toBeInTheDocument();
  });

  it('renders administration menus when the user has any related permission', () => {
    mockUseAuthorization.mockReturnValue({
      canAny: (requiredPermissions: string[]) =>
        requiredPermissions.includes(permissions.users.create),
      can: vi.fn(),
      canAll: vi.fn(),
    });

    renderSidebar();

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.getByText('Administration')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.queryByText('Roles & Permissions')).not.toBeInTheDocument();
    expect(screen.queryByText('Audit Logs')).not.toBeInTheDocument();
  });

  it('renders no menus when the user has no related permissions', () => {
    mockUseAuthorization.mockReturnValue({
      canAny: () => false,
      can: vi.fn(),
      canAll: vi.fn(),
    });

    renderSidebar();

    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
    expect(screen.queryByText('Administration')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Users')).not.toBeInTheDocument();
    expect(screen.queryByText('Roles & Permissions')).not.toBeInTheDocument();
    expect(screen.queryByText('Audit Logs')).not.toBeInTheDocument();
  });
});
