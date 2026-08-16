import { apiClient } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { ApiResponse } from '../api/types';
import type {
  AuthUser,
  LoginCredentials,
  LoginData,
  UpdateProfileData,
  ResetPasswordData,
  ChangePasswordData,
} from './types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginData> {
    const response = await apiClient.post<ApiResponse<LoginData>>(
      endpoints.auth.login,
      {
        login: credentials.login,
        password: credentials.password,
        remember_me: credentials.rememberMe,
      },
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

  async updateProfile(data: UpdateProfileData): Promise<AuthUser> {
    const response = await apiClient.put<ApiResponse<AuthUser>>(
      endpoints.auth.profile,
      data,
    );

    return response.data.data;
  },

  async updateAvatar(file: File): Promise<AuthUser> {
    const formData = new FormData();

    formData.append('avatar', file);

    const response = await apiClient.post<ApiResponse<AuthUser>>(
      endpoints.auth.profileAvatar,
      formData,
    );

    return response.data.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post<ApiResponse>(endpoints.auth.forgotPassword, {
      email,
    });
  },

  async resetPassword(data: ResetPasswordData): Promise<void> {
    await apiClient.post<ApiResponse>(endpoints.auth.resetPassword, data);
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    await apiClient.post(endpoints.auth.changePassword, data);
  },
};
