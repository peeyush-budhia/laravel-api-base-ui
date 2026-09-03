import type { PaginatedResponse } from './pagination';

export type AuditEvent =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'restored'
  | 'force_deleted'
  | 'permissions_synced';

export const auditEventLabels: Record<AuditEvent, string> = {
  created: 'Created',
  updated: 'Updated',
  deleted: 'Deleted',
  restored: 'Restored',
  force_deleted: 'Force Deleted',
  permissions_synced: 'Permissions Synced',
};

export const auditEventColors: Record<
  AuditEvent,
  'success' | 'info' | 'error' | 'warning'
> = {
  created: 'success',
  updated: 'info',
  deleted: 'error',
  restored: 'warning',
  force_deleted: 'error',
  permissions_synced: 'info',
};

export interface AuditLogUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
}

export interface AuditLog {
  id: string;
  event: AuditEvent | string;
  auditable_type: string;
  auditable_id: string;
  user_id: string | null;

  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;

  url: string | null;
  ip_address: string | null;
  user_agent: string | null;

  created_at: string;
  updated_at: string | null;

  user: AuditLogUser | null;
}

export interface AuditLogListParams {
  page?: number;
  perPage?: number;
  search?: string;
  event?: string;
  userId?: string;
  auditableType?: string;
  auditableId?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export type AuditLogListResponse = PaginatedResponse<AuditLog>;
