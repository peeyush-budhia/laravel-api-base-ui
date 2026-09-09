import type { AuditEvent, UserStatus } from './generated/api';
import type { SemanticTone } from './semanticTone';

export type DashboardUserStatus = UserStatus;

export interface DashboardUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  status: DashboardUserStatus;
  status_label?: string | null;
  status_tone?: 'success' | 'warning' | 'danger' | 'info' | null;
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface DashboardUserStatistics {
  by_status: Record<DashboardUserStatus, number>;
  status_labels?: Partial<Record<DashboardUserStatus, string>>;
  status_tones?: Partial<Record<DashboardUserStatus, SemanticTone>>;
  recent: DashboardUser[];
  recently_active: DashboardUser[];
}

export interface DashboardSummary {
  users: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  };
  roles: {
    total: number;
  };
  permissions: {
    total: number;
  };
  audit_logs: {
    total: number;
  };
}

export interface DashboardAuditLogUser {
  id: string;
  full_name?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
}

export interface DashboardAuditLog {
  id: string;
  event: AuditEvent;
  event_label?: string | null;
  event_tone?: 'success' | 'warning' | 'danger' | 'info' | null;
  auditable_type: string;
  user_id: string | null;
  created_at: string;
  updated_at: string | null;
  user: DashboardAuditLogUser | null;
}

export interface DashboardAuditStatistics {
  by_event: Partial<Record<AuditEvent, number>>;
  event_labels?: Partial<Record<AuditEvent, string>>;
  event_tones?: Partial<Record<AuditEvent, SemanticTone>>;
  recent: DashboardAuditLog[];
}

export interface DashboardData {
  summary: DashboardSummary;
  users: DashboardUserStatistics;
  audit: DashboardAuditStatistics;
}
