import { apiClient } from './client';
import { endpoints } from './endpoints';
import type {
  CreateUserPayload,
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
        },
      },
    );
    return response.data;
  },

  async show(id: string): Promise<User> {
    const response = await apiClient.get<{
      data: User;
      errors: unknown;
    }>(`${endpoints.users.index}/${id}`);

    return response.data.data;
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const response = await apiClient.post<{
      data: User;
      errors: unknown;
    }>(endpoints.users.index, payload);

    return response.data.data;
  },
};
