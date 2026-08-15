export interface Role {
  id: number | string;
  name: string;
  guard_name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface RoleListResponse {
  data: Role[];
  errors: unknown;
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
