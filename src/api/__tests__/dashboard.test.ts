import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '../client';
import { dashboardApi } from '../dashboard';

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('dashboardApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gets dashboard data', async () => {
    const dashboard = {
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
        recent: [],
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
        recent: [],
      },
    };

    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Dashboard retrieved successfully.',
        data: dashboard,
        errors: null,
        meta: {},
      },
    });

    const response = await dashboardApi.get();

    expect(apiClient.get).toHaveBeenCalledWith('/dashboard');

    expect(response).toEqual(dashboard);
  });

  it('returns dashboard collections as provided by the API', async () => {
    const dashboard = {
      summary: {
        users: {
          total: 0,
          active: 0,
          inactive: 0,
          suspended: 0,
        },
        roles: {
          total: 0,
        },
        permissions: {
          total: 0,
        },
        audit_logs: {
          total: 0,
        },
      },
      users: {
        by_status: {},
        recent: [],
        recently_active: [],
      },
      audit: {
        by_event: {},
        recent: [],
      },
    };

    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Dashboard retrieved successfully.',
        data: dashboard,
        errors: null,
        meta: {},
      },
    });

    const response = await dashboardApi.get();

    expect(response.users.by_status).toEqual({});
    expect(response.users.recent).toEqual([]);
    expect(response.users.recently_active).toEqual([]);
    expect(response.audit.by_event).toEqual({});
    expect(response.audit.recent).toEqual([]);
  });
});
