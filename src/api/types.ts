export interface ApiResponse<T = unknown> {
  success: true;
  status: number;
  message: string;
  data: T;
  errors: null;
  meta: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  status: number;
  message: string;
  data: null;
  errors: Record<string, string[]> | null;
  meta: Record<string, unknown>;
}

export interface ApiError {
  status: number | null;
  message: string;
  errors: Record<string, string[]> | null;
}
