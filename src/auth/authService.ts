import { apiClient } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { ApiResponse } from '../api/types';
import type { AuthUser, LoginCredentials, LoginData } from './types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginData> {
    const response = await apiClient.post<ApiResponse<LoginData>>(
      endpoints.auth.login,
      credentials,
    );

    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post<ApiResponse>(endpoints.auth.logout);
  },

  async me(): Promise<AuthUser> {
    const response = await apiClient.get<ApiResponse<AuthUser>>(
      endpoints.auth.me,
    );

    return response.data.data;
  },
};
