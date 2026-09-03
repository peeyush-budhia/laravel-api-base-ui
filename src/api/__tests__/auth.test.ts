import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '../../api/client';
import { authService } from '../../auth/authService';
import type {
  AuthUser,
  ChangePasswordData,
  LoginCredentials,
  LoginData,
  ResetPasswordData,
} from '../../auth/types';

vi.mock('../../api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs in a user', async () => {
    const credentials: LoginCredentials = {
      login: 'john@example.com',
      password: 'password',
      rememberMe: true,
    };

    const loginData: LoginData = {
      user: {
        id: 'user-1',
        first_name: 'John',
        last_name: 'Doe',
        full_name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
        role: 'Administrator',
        permissions: ['permissions.dashboard.view'],
        status: 'active',
        must_change_password: false,
        email_verified_at: '2026-08-01T10:00:00Z',
        last_login_at: null,
        created_at: '2026-08-01T10:00:00Z',
        updated_at: '2026-08-01T10:00:00Z',
        deleted_at: null,
      },
      token: 'test-token',
    };

    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Login successful.',
        data: loginData,
        errors: null,
      },
    });

    const response = await authService.login(credentials);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      login: 'john@example.com',
      password: 'password',
      remember_me: true,
    });

    expect(response).toEqual(loginData);
  });

  it('logs in with remember me disabled', async () => {
    const credentials: LoginCredentials = {
      login: 'john@example.com',
      password: 'password',
      rememberMe: false,
    };

    const loginData: LoginData = {
      user: {
        id: 'user-1',
        first_name: 'John',
        last_name: 'Doe',
        full_name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
        role: null,
        permissions: [],
        status: 'active',
        must_change_password: false,
        email_verified_at: null,
        last_login_at: null,
        created_at: null,
        updated_at: null,
        deleted_at: null,
      },
      token: 'test-token',
    };

    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Login successful.',
        data: loginData,
        errors: null,
      },
    });

    await authService.login(credentials);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      login: 'john@example.com',
      password: 'password',
      remember_me: false,
    });
  });

  it('logs out the authenticated user', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Logout successful.',
        data: null,
        errors: null,
      },
    });

    await authService.logout();

    expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
  });

  it('gets the authenticated user', async () => {
    const user: AuthUser = {
      id: 'user-1',
      first_name: 'John',
      last_name: 'Doe',
      full_name: 'John Doe',
      email: 'john@example.com',
      avatar: null,
      role: 'Administrator',
      permissions: ['permissions.dashboard.view'],
      status: 'active',
      must_change_password: false,
      email_verified_at: '2026-08-01T10:00:00Z',
      last_login_at: '2026-08-26T10:00:00Z',
      created_at: '2026-08-01T10:00:00Z',
      updated_at: '2026-08-26T10:00:00Z',
      deleted_at: null,
    };

    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Authenticated user retrieved successfully.',
        data: user,
        errors: null,
      },
    });

    const response = await authService.me();

    expect(apiClient.get).toHaveBeenCalledWith('/auth/me');

    expect(response).toEqual(user);
  });

  it('requests a password reset', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Password reset link sent successfully.',
        data: null,
        errors: null,
      },
    });

    await authService.forgotPassword('john@example.com');

    expect(apiClient.post).toHaveBeenCalledWith('/auth/forgot-password', {
      email: 'john@example.com',
    });
  });

  it('resets the password', async () => {
    const data: ResetPasswordData = {
      token: 'reset-token',
      email: 'john@example.com',
      password: 'NewPassword123!',
      password_confirmation: 'NewPassword123!',
    };

    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Password reset successfully.',
        data: null,
        errors: null,
      },
    });

    await authService.resetPassword(data);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/reset-password', data);
  });

  it('changes the authenticated user password', async () => {
    const data: ChangePasswordData = {
      current_password: 'OldPassword123!',
      password: 'NewPassword123!',
      password_confirmation: 'NewPassword123!',
    };

    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Password changed successfully.',
        data: null,
        errors: null,
      },
    });

    await authService.changePassword(data);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/change-password', data);
  });

  it('gets the password policy', async () => {
    const passwordPolicy = {
      min_length: 12,
      require_mixed_case: true,
      require_numbers: true,
      require_symbols: true,
    };

    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Password policy retrieved successfully.',
        data: passwordPolicy,
        errors: null,
      },
    });

    const response = await authService.getPasswordPolicy();

    expect(apiClient.get).toHaveBeenCalledWith('/auth/password-policy');

    expect(response).toEqual(passwordPolicy);
  });
});
