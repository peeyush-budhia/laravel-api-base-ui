import type { PaginatedResponse } from './pagination';

export interface Role {
  id: string;
  name: string;
  guard_name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  guard_name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface RoleListParams {
  page?: number;
  perPage?: number;
  search?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export type RoleListResponse = PaginatedResponse<Role>;

export interface RoleResponse {
  data: Role;
  errors: unknown;
}

export interface RolePermissionsResponse {
  data: Permission[];
  errors: unknown;
}

export interface PermissionListResponse {
  data: Permission[];
  errors: unknown;
}
