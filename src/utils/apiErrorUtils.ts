import type { ApiError } from '../api/types';

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Unable to complete the request.',
): string {
  const apiError = getApiError(error);

  if (apiError?.message) {
    return apiError.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function getApiError(error: unknown): ApiError | null {
  return isApiError(error) ? error : null;
}

export function getApiFieldErrors(error: unknown): Record<string, string[]> {
  return getApiError(error)?.errors ?? {};
}

export function isApiError(error: unknown): error is ApiError {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const value = error as Record<string, unknown>;

  return (
    'message' in value &&
    typeof value.message === 'string' &&
    ('status' in value || 'errors' in value)
  );
}
