import { PaginatedResponse } from './pagination';

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

export type UserTrashedFilter = 'without' | 'with' | 'only';
export const userTrashedFilterLabels: Record<UserTrashedFilter, string> = {
  without: 'Active Users',
  with: 'All Users',
  only: 'Deleted Users',
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
export interface UserListParams {
  page?: number;
  perPage?: number;
  search?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
  trashed?: UserTrashedFilter;
}

export type UserListResponse = PaginatedResponse<User>;
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
