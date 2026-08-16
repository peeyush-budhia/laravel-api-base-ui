export type UserStatus = 'active' | 'inactive' | 'suspended';

export const userStatusLabels: Record<UserStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
};

export const userStatusColors: Record<
  UserStatus,
  'success' | 'warning' | 'error'
> = {
  active: 'success',
  inactive: 'warning',
  suspended: 'error',
};

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  avatar: string | null;
  role: string | null;
  permissions: string[];
  status: UserStatus;
  must_change_password: boolean;
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
  path: string;
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export interface UserListParams {
  page?: number;
  perPage?: number;
  search?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface UserListResponse {
  data: User[];
  errors: unknown;
  meta: PaginationMeta;
}

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: UserStatus;
}

export interface UpdateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: UserStatus;
}
