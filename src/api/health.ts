import { apiClient } from './client';
import { endpoints } from './endpoints';

export const healthApi = {
  async check(): Promise<boolean> {
    const response = await apiClient.get(endpoints.health);

    return response.status === 200;
  },
};
