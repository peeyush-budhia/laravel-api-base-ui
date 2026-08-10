export interface AuthUser {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  avatar: string | null;
  status: string;
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface LoginData {
  user: AuthUser;
  token: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
