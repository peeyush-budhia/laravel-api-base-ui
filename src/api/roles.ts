import { apiClient } from './client';
import { endpoints } from './endpoints';

import type {
  Permission,
  Role,
  RoleListParams,
  RoleListResponse,
  RolePermissionsResponse,
  RoleResponse,
} from '../types/role';

export const rolesApi = {
  async list(params: RoleListParams = {}): Promise<RoleListResponse> {
    const response = await apiClient.get<RoleListResponse>(
      endpoints.roles.index,
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

  async show(id: string): Promise<Role> {
    const response = await apiClient.get<RoleResponse>(
      `${endpoints.roles.index}/${id}`,
    );

    return response.data.data;
  },

  async create(data: { name: string }): Promise<Role> {
    const response = await apiClient.post<RoleResponse>(
      endpoints.roles.index,
      data,
    );

    return response.data.data;
  },

  async update(id: string, data: { name: string }): Promise<Role> {
    const response = await apiClient.put<RoleResponse>(
      `${endpoints.roles.index}/${id}`,
      data,
    );

    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`${endpoints.roles.index}/${id}`);
  },

  async permissions(id: string): Promise<Permission[]> {
    const response = await apiClient.get<RolePermissionsResponse>(
      `${endpoints.roles.index}/${id}/permissions`,
    );

    return response.data.data;
  },

  async syncPermissions(id: string, permissions: string[]): Promise<Role> {
    const response = await apiClient.put<RoleResponse>(
      `${endpoints.roles.index}/${id}/permissions`,
      {
        permissions,
      },
    );

    return response.data.data;
  },
};
