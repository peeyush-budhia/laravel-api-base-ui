import { apiClient } from './client';
import { endpoints } from './endpoints';
import type { ApiResponse } from './types';
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
  UserListParams,
  UserListResponse,
} from '../types/user';

export const usersApi = {
  async list(params: UserListParams = {}): Promise<UserListResponse> {
    const response = await apiClient.get<UserListResponse>(
      endpoints.users.index,
      {
        params: {
          page: params.page,
          per_page: params.perPage,
          search: params.search || undefined,
          sort: params.sort,
          direction: params.direction,
          trashed: params.trashed,
        },
      },
    );

    return response.data;
  },

  async show(id: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      endpoints.users.show(id),
    );

    return response.data.data;
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      endpoints.users.index,
      payload,
    );

    return response.data.data;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(
      endpoints.users.show(id),
      payload,
    );

    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(endpoints.users.show(id));
  },

  async restore(id: string): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(
      endpoints.users.restore(id),
    );

    return response.data.data;
  },

  async forceDelete(id: string): Promise<void> {
    await apiClient.delete(endpoints.users.forceDelete(id));
  },
};
