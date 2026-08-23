import axios, {
  isAxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '../config/env';
import { tokenStorage } from '../auth/token';
import type { ApiError, ApiErrorResponse } from './types';

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

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error: unknown) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!isAxiosError(error)) {
      const apiError: ApiError = {
        status: null,
        message: 'Unable to complete the request.',
        errors: null,
      };

      return Promise.reject(apiError);
    }

    const response = error.response;

    if (response?.status === 401) {
      tokenStorage.clear();
    }

    if (response?.data && isApiErrorResponse(response.data)) {
      const apiError: ApiError = {
        status: response.data.status,
        message: response.data.message,
        errors: response.data.errors,
      };

      return Promise.reject(apiError);
    }

    const apiError: ApiError = {
      status: response?.status ?? null,
      message: getFallbackErrorMessage(error),
      errors: null,
    };

    return Promise.reject(apiError);
  },
);

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    data.success === false &&
    typeof data.status === 'number' &&
    typeof data.message === 'string' &&
    (data.data === null || data.data === undefined) &&
    (data.errors === null || typeof data.errors === 'object') &&
    typeof data.meta === 'object'
  );
}

function getFallbackErrorMessage(error: { message?: string }): string {
  if (error.message) {
    return error.message;
  }

  return 'Unable to complete the request.';
}

export { apiClient };
