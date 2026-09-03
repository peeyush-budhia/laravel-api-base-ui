import { apiClient } from './client';
import { endpoints } from './endpoints';
import type { ApiResponse } from './types';
import type { DashboardData } from '../types/dashboard';

export const dashboardApi = {
  async get(): Promise<DashboardData> {
    const response = await apiClient.get<ApiResponse<DashboardData>>(
      endpoints.dashboard.index,
    );

    return response.data.data;
  },
};
