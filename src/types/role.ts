import type { ApiResponse } from '../api/types';
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

export type RoleResponse = ApiResponse<Role>;

export type RolePermissionsResponse = ApiResponse<Permission[]>;

export type PermissionListResponse = ApiResponse<Permission[]>;

export interface CreateRoleData {
  name: string;
}

export interface UpdateRoleData {
  name: string;
}

export interface SyncRolePermissionsData {
  permissions: string[];
}
