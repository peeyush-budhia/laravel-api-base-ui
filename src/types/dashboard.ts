export type DashboardUserStatus = 'active' | 'inactive' | 'suspended';

export interface DashboardUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  status: DashboardUserStatus;
  email_verified_at: string | null;
  last_login_at: string | null;
  must_change_password: boolean;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface DashboardUserStatistics {
  by_status: Record<DashboardUserStatus, number>;
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
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
}

export interface DashboardAuditLog {
  id: string;
  event: string;
  auditable_type: string;
  user_id: string | null;
  created_at: string;
  updated_at: string | null;
  user: DashboardAuditLogUser | null;
}

export interface DashboardAuditStatistics {
  by_event: Record<string, number>;
  recent: DashboardAuditLog[];
}

export interface DashboardData {
  summary: DashboardSummary;
  users: DashboardUserStatistics;
  audit: DashboardAuditStatistics;
}
