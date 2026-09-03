import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '../client';
import { rolesApi } from '../roles';

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('rolesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists roles', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Roles retrieved successfully.',
        data: [],
        errors: null,
        meta: {
          current_page: 1,
          per_page: 15,
          total: 0,
          last_page: 1,
          from: null,
          to: null,
          path: '/api/v1/roles',
          links: [],
        },
      },
    });

    const response = await rolesApi.list({
      page: 1,
      perPage: 15,
    });

    expect(apiClient.get).toHaveBeenCalledWith('/roles', {
      params: {
        page: 1,
        per_page: 15,
        search: undefined,
        sort: undefined,
        direction: undefined,
      },
    });

    expect(response.data).toEqual([]);
  });

  it('gets a role by id', async () => {
    const role = {
      id: 'role-1',
      name: 'Administrator',
      guard_name: 'sanctum',
    };

    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Role retrieved successfully.',
        data: role,
        errors: null,
        meta: {},
      },
    });

    const response = await rolesApi.show('role-1');

    expect(apiClient.get).toHaveBeenCalledWith('/roles/role-1');

    expect(response).toEqual(role);
  });

  it('gets all permissions', async () => {
    const permissions = [
      {
        id: 'permission-1',
        name: 'users.view',
        guard_name: 'sanctum',
      },
    ];

    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Permissions retrieved successfully.',
        data: permissions,
        errors: null,
        meta: {},
      },
    });

    const response = await rolesApi.allPermissions();

    expect(apiClient.get).toHaveBeenCalledWith('/roles/permissions');

    expect(response).toEqual(permissions);
  });

  it('creates a role', async () => {
    const role = {
      id: 'role-1',
      name: 'Manager',
      guard_name: 'sanctum',
    };

    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        success: true,
        status: 201,
        message: 'Role created successfully.',
        data: role,
        errors: null,
        meta: {},
      },
    });

    const response = await rolesApi.create({
      name: 'Manager',
    });

    expect(apiClient.post).toHaveBeenCalledWith('/roles', {
      name: 'Manager',
    });

    expect(response).toEqual(role);
  });

  it('updates a role', async () => {
    const role = {
      id: 'role-1',
      name: 'Senior Manager',
      guard_name: 'sanctum',
    };

    vi.mocked(apiClient.put).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Role updated successfully.',
        data: role,
        errors: null,
        meta: {},
      },
    });

    const response = await rolesApi.update('role-1', {
      name: 'Senior Manager',
    });

    expect(apiClient.put).toHaveBeenCalledWith('/roles/role-1', {
      name: 'Senior Manager',
    });

    expect(response).toEqual(role);
  });

  it('deletes a role', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({
      data: {},
    });

    await rolesApi.remove('role-1');

    expect(apiClient.delete).toHaveBeenCalledWith('/roles/role-1');
  });

  it('gets permissions assigned to a role', async () => {
    const permissions = [
      {
        id: 'permission-1',
        name: 'users.view',
        guard_name: 'sanctum',
      },
    ];

    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Role permissions retrieved successfully.',
        data: permissions,
        errors: null,
        meta: {},
      },
    });

    const response = await rolesApi.permissions('role-1');

    expect(apiClient.get).toHaveBeenCalledWith('/roles/role-1/permissions');

    expect(response).toEqual(permissions);
  });

  it('synchronizes role permissions', async () => {
    const role = {
      id: 'role-1',
      name: 'Manager',
      guard_name: 'sanctum',
    };

    vi.mocked(apiClient.put).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Role permissions updated successfully.',
        data: role,
        errors: null,
        meta: {},
      },
    });

    const response = await rolesApi.syncPermissions('role-1', {
      permissions: ['users.view', 'users.update'],
    });

    expect(apiClient.put).toHaveBeenCalledWith('/roles/role-1/permissions', {
      permissions: ['users.view', 'users.update'],
    });

    expect(response).toEqual(role);
  });
});
