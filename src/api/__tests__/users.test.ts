import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usersApi } from '../users';
import { apiClient } from '../client';

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('usersApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists users', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Users retrieved successfully.',
        data: [],
        errors: null,
        meta: {
          current_page: 1,
          per_page: 15,
          total: 0,
          last_page: 1,
          from: null,
          to: null,
          path: '/api/v1/users',
          links: [],
        },
      },
    });

    const response = await usersApi.list({
      page: 1,
      perPage: 15,
    });

    expect(apiClient.get).toHaveBeenCalledWith('/users', {
      params: {
        page: 1,
        per_page: 15,
        search: undefined,
        sort: undefined,
        direction: undefined,
        trashed: undefined,
      },
    });

    expect(response.data).toEqual([]);
  });

  it('gets a user by id', async () => {
    const user = {
      id: 'user-1',
      first_name: 'John',
      last_name: 'Doe',
    };

    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'User retrieved successfully.',
        data: user,
        errors: null,
        meta: {},
      },
    });

    const response = await usersApi.show('user-1');

    expect(apiClient.get).toHaveBeenCalledWith('/users/user-1');

    expect(response).toEqual(user);
  });

  it('deletes a user', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({
      data: {},
    });

    await usersApi.delete('user-1');

    expect(apiClient.delete).toHaveBeenCalledWith('/users/user-1');
  });
});
