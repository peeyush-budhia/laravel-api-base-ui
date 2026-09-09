import type { PaginatedResponse } from './pagination';
import type { SemanticTone } from './semanticTone';
export { semanticToneColors } from './semanticTone';
export type { AuditEvent } from './generated/api';
import type { AuditEvent } from './generated/api';

export interface AuditLogUser {
  id: string;
  full_name?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
}

export interface AuditLog {
  id: string;
  event: AuditEvent;
  event_label?: string | null;
  event_tone?: SemanticTone | null;
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
