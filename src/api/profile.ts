import { AuthUser } from '../auth/types';
import { UpdateProfileData } from '../types/profile';
import { apiClient } from './client';
import { endpoints } from './endpoints';
import type { ApiResponse } from './types';

export const profile = {
  async updateProfile(data: UpdateProfileData): Promise<AuthUser> {
    const response = await apiClient.put<ApiResponse<AuthUser>>(
      endpoints.profile.index,
      data,
    );

    return response.data.data;
  },

  async updateAvatar(file: File): Promise<AuthUser> {
    const formData = new FormData();

    formData.append('avatar', file);

    const response = await apiClient.post<ApiResponse<AuthUser>>(
      endpoints.profile.avatar,
      formData,
    );

    return response.data.data;
  },
};
