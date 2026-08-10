import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '../config/env';
import { tokenStorage } from '../auth/token';
import type { ApiErrorResponse } from './types';

const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.get();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = error as {
      response?: {
        data?: ApiErrorResponse;
        status?: number;
      };
    };

    if (apiError.response?.status === 401) {
      tokenStorage.clear();
    }

    return Promise.reject(error);
  },
);

export { apiClient };
