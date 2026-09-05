import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AppHeader from '../AppHeader';
import { healthApi } from '../../api/health';

const mockUseSidebar = vi.fn();

vi.mock('../../context/SidebarContext', () => ({
  useSidebar: () => mockUseSidebar(),
}));

vi.mock('../../api/health', () => ({
  healthApi: {
    check: vi.fn(),
  },
}));

vi.mock('../../components/common/ThemeToggleButton', () => ({
  ThemeToggleButton: () => <button type="button">Theme</button>,
}));

vi.mock('../../components/header/UserDropdown', () => ({
  default: () => <div>User menu</div>,
}));

describe('AppHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSidebar.mockReturnValue({
      isMobileOpen: false,
      toggleSidebar: vi.fn(),
      toggleMobileSidebar: vi.fn(),
    });
  });

  it('shows the API health status when the health check succeeds', async () => {
    vi.mocked(healthApi.check).mockResolvedValue(true);

    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('System is healthy!')).toBeInTheDocument();
    });

    const status = screen.getByText('System is healthy!').parentElement;

    expect(status).toHaveClass('inline-flex');
    expect(status?.querySelector('.bg-success-500')).toBeInTheDocument();
  });

  it('hides the API health status when the health check fails', async () => {
    vi.mocked(healthApi.check).mockResolvedValue(false);

    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(healthApi.check).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByText('System is healthy!')).not.toBeInTheDocument();
  });
});
