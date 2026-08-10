export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
