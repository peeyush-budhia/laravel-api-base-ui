import { apiClient } from './client';
import { endpoints } from './endpoints';
import type { RoleListResponse } from '../types/role';

export const rolesApi = {
  async list(): Promise<RoleListResponse> {
    const response = await apiClient.get<RoleListResponse>(
      endpoints.roles.index,
      {
        params: {
          per_page: 100,
        },
      },
    );

    return response.data;
  },
};
