import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import Home from '../Home';
import { dashboardApi } from '../../../api/dashboard';
import { useAuthorization } from '../../../auth/useAuthorization';
import { permissions } from '../../../auth/permissions';
import type { DashboardData } from '../../../types/dashboard';

vi.mock('../../../api/dashboard', () => ({
  dashboardApi: {
    get: vi.fn(),
  },
}));

vi.mock('../../../auth/useAuthorization', () => ({
  useAuthorization: vi.fn(),
}));

vi.mock('../../../icons', () => {
  const Icon = () => <svg aria-hidden="true" />;

  return {
    GroupIcon: Icon,
    KeyIcon: Icon,
    ListIcon: Icon,
    ShieldIcon: Icon,
  };
});

const dashboard: DashboardData = {
  summary: {
    users: {
      total: 100,
      active: 90,
      inactive: 5,
      suspended: 5,
    },
    roles: {
      total: 5,
    },
    permissions: {
      total: 25,
    },
    audit_logs: {
      total: 250,
    },
  },
  users: {
    by_status: {
      active: 90,
      inactive: 5,
      suspended: 5,
    },
    recent: [
      {
        id: 'user-1',
        first_name: 'Taylor',
        last_name: 'Swift',
        email: 'taylor@example.com',
        avatar: null,
        status: 'active',
        email_verified_at: null,
        last_login_at: null,
        created_at: null,
        updated_at: null,
        deleted_at: null,
      },
    ],
    recently_active: [],
  },
  audit: {
    by_event: {
      created: 100,
      updated: 120,
      deleted: 20,
      restored: 5,
      force_deleted: 5,
    },
    recent: [
      {
        id: 'log-1',
        event: 'permissions_synced',
        auditable_type: 'App\\Models\\Role',
        user_id: null,
        created_at: '2026-09-03T10:15:00.000Z',
        updated_at: null,
        user: null,
      },
    ],
  },
};

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
}

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the loading state before dashboard data arrives', () => {
    vi.mocked(useAuthorization).mockReturnValue({
      can: (permission) => permission === permissions.dashboard.view,
      canAny: vi.fn(),
      canAll: vi.fn(),
    });

    vi.mocked(dashboardApi.get).mockImplementation(
      () => new Promise(() => undefined),
    );

    renderHome();

    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('renders dashboard widgets and hides audit widgets without audit permission', async () => {
    vi.mocked(useAuthorization).mockReturnValue({
      can: (permission) => permission === permissions.dashboard.view,
      canAny: vi.fn(),
      canAll: vi.fn(),
    });

    vi.mocked(dashboardApi.get).mockResolvedValue(dashboard);

    renderHome();

    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();

    expect(await screen.findByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Taylor Swift')).toBeInTheDocument();
    expect(screen.getByText('taylor@example.com')).toBeInTheDocument();
    expect(screen.getByText('No recently active users')).toBeInTheDocument();
    expect(screen.queryByText('Recent Audit Logs')).not.toBeInTheDocument();
    expect(screen.queryByText('Audit Activity')).not.toBeInTheDocument();
  });

  it('renders the audit widgets when audit permission is granted', async () => {
    vi.mocked(useAuthorization).mockReturnValue({
      can: (permission) =>
        permission === permissions.dashboard.view ||
        permission === permissions.auditLogs.view,
      canAny: vi.fn(),
      canAll: vi.fn(),
    });

    vi.mocked(dashboardApi.get).mockResolvedValue(dashboard);

    renderHome();

    expect(await screen.findByText('Recent Audit Logs')).toBeInTheDocument();
    expect(screen.getByText('Audit Activity')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('System action')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
  });

  it('renders an error state when dashboard loading fails', async () => {
    vi.mocked(useAuthorization).mockReturnValue({
      can: (permission) => permission === permissions.dashboard.view,
      canAny: vi.fn(),
      canAll: vi.fn(),
    });

    vi.mocked(dashboardApi.get).mockRejectedValue(new Error('Server error.'));

    renderHome();

    expect(
      await screen.findByText('Unable to load dashboard'),
    ).toBeInTheDocument();
    expect(screen.getByText('Server error.')).toBeInTheDocument();
  });

  it('renders the unauthorized screen without dashboard permission', async () => {
    vi.mocked(useAuthorization).mockReturnValue({
      can: () => false,
      canAny: vi.fn(),
      canAll: vi.fn(),
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('ACCESS DENIED')).toBeInTheDocument();
    });

    expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument();
  });
});
