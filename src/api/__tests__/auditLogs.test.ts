import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '../client';
import { auditLogsApi } from '../auditLogs';

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('auditLogsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists audit logs', async () => {
    const auditLogs = [
      {
        id: 'audit-1',
        event: 'created',
        auditable_type: 'App\\Models\\User',
        auditable_id: 'user-1',
        user_id: 'user-1',
        old_values: null,
        new_values: {
          first_name: 'John',
        },
        url: 'http://example.test/api/v1/users',
        ip_address: '127.0.0.1',
        user_agent: 'PHPUnit',
        created_at: '2026-08-29T10:00:00.000000Z',
        updated_at: null,
        user: null,
      },
    ];

    const meta = {
      current_page: 1,
      per_page: 15,
      total: 1,
      last_page: 1,
      from: 1,
      to: 1,
      path: '/api/v1/audit-logs',
      links: [],
    };

    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Audit logs retrieved successfully.',
        data: auditLogs,
        errors: null,
        meta,
      },
    });

    const response = await auditLogsApi.list({
      page: 1,
      perPage: 15,
    });

    expect(apiClient.get).toHaveBeenCalledWith('/audit-logs', {
      params: {
        page: 1,
        per_page: 15,
        search: undefined,
        event: undefined,
        user_id: undefined,
        sort: undefined,
        direction: undefined,
      },
    });

    expect(response.data).toEqual(auditLogs);
    expect(response.meta).toEqual(meta);
  });

  it('lists audit logs with search', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Audit logs retrieved successfully.',
        data: [],
        errors: null,
        meta: {
          current_page: 1,
          per_page: 15,
          total: 0,
          last_page: 1,
          from: null,
          to: null,
          path: '/api/v1/audit-logs',
          links: [],
        },
      },
    });

    await auditLogsApi.list({
      page: 1,
      perPage: 15,
      search: 'user-123',
    });

    expect(apiClient.get).toHaveBeenCalledWith('/audit-logs', {
      params: {
        page: 1,
        per_page: 15,
        search: 'user-123',
        event: undefined,
        user_id: undefined,
        sort: undefined,
        direction: undefined,
      },
    });
  });

  it('lists audit logs with filters and sorting', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Audit logs retrieved successfully.',
        data: [],
        errors: null,
        meta: {
          current_page: 1,
          per_page: 15,
          total: 0,
          last_page: 1,
          from: null,
          to: null,
          path: '/api/v1/audit-logs',
          links: [],
        },
      },
    });

    await auditLogsApi.list({
      page: 2,
      perPage: 25,
      event: 'updated',
      userId: 'user-1',
      sort: 'created_at',
      direction: 'desc',
    });

    expect(apiClient.get).toHaveBeenCalledWith('/audit-logs', {
      params: {
        page: 2,
        per_page: 25,
        search: undefined,
        event: 'updated',
        user_id: 'user-1',
        sort: 'created_at',
        direction: 'desc',
      },
    });
  });

  it('returns audit logs with user information', async () => {
    const auditLog = {
      id: 'audit-1',
      event: 'created',
      auditable_type: 'App\\Models\\User',
      auditable_id: 'user-1',
      user_id: 'user-1',
      old_values: null,
      new_values: {
        first_name: 'John',
      },
      url: null,
      ip_address: '127.0.0.1',
      user_agent: 'PHPUnit',
      created_at: '2026-08-29T10:00:00.000000Z',
      updated_at: null,
      user: {
        id: 'user-1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        avatar: null,
      },
    };

    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Audit logs retrieved successfully.',
        data: [auditLog],
        errors: null,
        meta: {
          current_page: 1,
          per_page: 15,
          total: 1,
          last_page: 1,
          from: 1,
          to: 1,
          path: '/api/v1/audit-logs',
          links: [],
        },
      },
    });

    const response = await auditLogsApi.list();

    expect(response.data).toHaveLength(1);

    expect(response.data[0].user).toEqual({
      id: 'user-1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      avatar: null,
    });
  });

  it('supports audit logs without a user', async () => {
    const auditLog = {
      id: 'audit-system-1',
      event: 'created',
      auditable_type: 'App\\Models\\System',
      auditable_id: 'system-1',
      user_id: null,
      old_values: null,
      new_values: null,
      url: null,
      ip_address: null,
      user_agent: null,
      created_at: '2026-08-29T10:00:00.000000Z',
      updated_at: null,
      user: null,
    };

    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Audit logs retrieved successfully.',
        data: [auditLog],
        errors: null,
        meta: {
          current_page: 1,
          per_page: 15,
          total: 1,
          last_page: 1,
          from: 1,
          to: 1,
          path: '/api/v1/audit-logs',
          links: [],
        },
      },
    });

    const response = await auditLogsApi.list();

    expect(response.data[0].user).toBeNull();
    expect(response.data[0].user_id).toBeNull();
  });

  it('gets an audit log by id', async () => {
    const auditLog = {
      id: 'audit-1',
      event: 'created',
      auditable_type: 'App\\Models\\User',
      auditable_id: 'user-1',
      user_id: 'user-1',
      old_values: null,
      new_values: {
        first_name: 'John',
      },
      url: null,
      ip_address: '127.0.0.1',
      user_agent: 'PHPUnit',
      created_at: '2026-08-29T10:00:00.000000Z',
      updated_at: null,
      user: {
        id: 'user-1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        avatar: null,
      },
    };

    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Audit log retrieved successfully.',
        data: auditLog,
        errors: null,
        meta: {},
      },
    });

    const response = await auditLogsApi.show('audit-1');

    expect(apiClient.get).toHaveBeenCalledWith('/audit-logs/audit-1');

    expect(response).toEqual(auditLog);
  });
});
