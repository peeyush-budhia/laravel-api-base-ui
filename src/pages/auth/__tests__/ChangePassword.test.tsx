import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import ChangePassword from '../ChangePassword';
import { authService } from '../../../auth/authService';
import { useAuth } from '../../../auth/useAuth';
import { usePasswordPolicy } from '../../../hooks/usePasswordPolicy';

vi.mock('../../../auth/authService', () => ({
  authService: {
    changePassword: vi.fn(),
  },
}));

vi.mock('../../../auth/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../../hooks/usePasswordPolicy', () => ({
  usePasswordPolicy: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockRefreshUser = vi.fn();

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderChangePassword() {
  return render(
    <MemoryRouter>
      <ChangePassword />
    </MemoryRouter>,
  );
}

describe('ChangePassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: 'user-1',
        first_name: 'John',
        last_name: 'Doe',
        full_name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
        role: 'Administrator',
        permissions: [],
        status: 'active',
        must_change_password: true,
        email_verified_at: null,
        last_login_at: null,
        created_at: null,
        updated_at: null,
        deleted_at: null,
      },
      isAuthenticated: true,
      isLoading: false,
      refreshUser: mockRefreshUser,
      login: vi.fn(),
      logout: vi.fn(),
    });

    vi.mocked(usePasswordPolicy).mockReturnValue({
      policy: {
        min_length: 12,
        require_mixed_case: true,
        require_numbers: true,
        require_symbols: true,
      },
      isLoading: false,
      error: '',
      reload: vi.fn(),
    });

    mockRefreshUser.mockResolvedValue(undefined);
    vi.mocked(authService.changePassword).mockResolvedValue(undefined);
  });

  it('loads and displays the backend password policy', () => {
    renderChangePassword();

    expect(screen.getByText('Password requirements')).toBeInTheDocument();

    const requirements = screen.getAllByRole('listitem');

    expect(
      requirements.some((item) =>
        item.textContent?.includes('At least 12 characters'),
      ),
    ).toBe(true);

    expect(
      requirements.some((item) =>
        item.textContent?.includes('One uppercase and one lowercase letter'),
      ),
    ).toBe(true);

    expect(
      requirements.some((item) =>
        item.textContent?.includes('At least one number'),
      ),
    ).toBe(true);

    expect(
      requirements.some((item) =>
        item.textContent?.includes('At least one symbol'),
      ),
    ).toBe(true);
  });

  it('rejects mismatched password confirmation', async () => {
    renderChangePassword();

    fireEvent.change(screen.getByLabelText('Current Password *'), {
      target: { value: 'CurrentPassword123!' },
    });

    fireEvent.change(screen.getByLabelText('New Password *'), {
      target: { value: 'SecurePassword12!' },
    });

    fireEvent.change(screen.getByLabelText('Confirm New Password *'), {
      target: { value: 'DifferentPassword12!' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update Password' }));

    expect(
      await screen.findByText('Passwords do not match.'),
    ).toBeInTheDocument();

    expect(authService.changePassword).not.toHaveBeenCalled();
  });

  it('changes the password and redirects after success', async () => {
    renderChangePassword();

    fireEvent.change(screen.getByLabelText('Current Password *'), {
      target: { value: 'CurrentPassword123!' },
    });

    fireEvent.change(screen.getByLabelText('New Password *'), {
      target: { value: 'SecurePassword12!' },
    });

    fireEvent.change(screen.getByLabelText('Confirm New Password *'), {
      target: { value: 'SecurePassword12!' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update Password' }));

    await waitFor(() => {
      expect(authService.changePassword).toHaveBeenCalledWith({
        current_password: 'CurrentPassword123!',
        password: 'SecurePassword12!',
        password_confirmation: 'SecurePassword12!',
      });
    });

    expect(mockRefreshUser).toHaveBeenCalledTimes(1);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
      replace: true,
    });
  });

  it('rejects a password that does not satisfy the backend policy', async () => {
    renderChangePassword();

    fireEvent.change(screen.getByLabelText('Current Password *'), {
      target: { value: 'CurrentPassword123!' },
    });

    fireEvent.change(screen.getByLabelText('New Password *'), {
      target: { value: 'weakpass' },
    });

    fireEvent.change(screen.getByLabelText('Confirm New Password *'), {
      target: { value: 'weakpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update Password' }));

    const newPasswordInput = screen.getByLabelText('New Password *');

    await waitFor(() => {
      expect(newPasswordInput).toHaveAttribute('aria-invalid', 'true');
    });

    const describedBy = newPasswordInput.getAttribute('aria-describedby');

    expect(describedBy).toBeTruthy();

    const errorElement = document.getElementById(describedBy!);

    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(
      'Password must be at least 12 characters.',
    );

    expect(authService.changePassword).not.toHaveBeenCalled();
  });

  it('displays API errors when password change fails', async () => {
    vi.mocked(authService.changePassword).mockRejectedValue({
      status: 422,
      message: 'Validation failed.',
      errors: {
        current_password: ['Current password is incorrect.'],
      },
    });

    renderChangePassword();

    fireEvent.change(screen.getByLabelText('Current Password *'), {
      target: { value: 'WrongPassword123!' },
    });

    fireEvent.change(screen.getByLabelText('New Password *'), {
      target: { value: 'SecurePassword12!' },
    });

    fireEvent.change(screen.getByLabelText('Confirm New Password *'), {
      target: { value: 'SecurePassword12!' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update Password' }));

    await waitFor(() => {
      expect(authService.changePassword).toHaveBeenCalledWith({
        current_password: 'WrongPassword123!',
        password: 'SecurePassword12!',
        password_confirmation: 'SecurePassword12!',
      });
    });

    expect(
      screen.getAllByText('Current password is incorrect.', {
        exact: true,
      }).length,
    ).toBe(1);

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockRefreshUser).not.toHaveBeenCalled();
  });
});
