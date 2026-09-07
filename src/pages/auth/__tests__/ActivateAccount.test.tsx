import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import ResetPasswordForm from '../../../components/auth/ResetPasswordForm';
import { authService } from '../../../auth/authService';
import { usePasswordPolicy } from '../../../hooks/usePasswordPolicy';
import { useToast } from '../../../components/common/useToast';

vi.mock('../../../auth/authService', () => ({
  authService: {
    resetPassword: vi.fn(),
  },
}));

vi.mock('../../../hooks/usePasswordPolicy', () => ({
  usePasswordPolicy: vi.fn(),
}));

vi.mock('../../../components/common/useToast', () => ({
  useToast: vi.fn(),
}));

vi.mock('../../../icons', () => ({
  EyeCloseIcon: () => <svg aria-hidden="true" />,
  EyeIcon: () => <svg aria-hidden="true" />,
}));

const mockNavigate = vi.fn();
const mockShowToast = vi.fn();

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderActivation(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ResetPasswordForm mode="activation" />
    </MemoryRouter>,
  );
}

describe('account activation', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useToast).mockReturnValue({
      showToast: mockShowToast,
      hideToast: vi.fn(),
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
    vi.mocked(authService.resetPassword).mockResolvedValue(undefined);
  });

  it('creates the password and redirects to sign in', async () => {
    renderActivation(
      '/activate-account?token=activation-token&email=new%40example.com',
    );

    expect(
      screen.getByRole('heading', { name: 'Activate Your Account' }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('New Password *'), {
      target: { value: 'SecurePassword12!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password *'), {
      target: { value: 'SecurePassword12!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Activate Account' }));

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith({
        token: 'activation-token',
        email: 'new@example.com',
        password: 'SecurePassword12!',
        password_confirmation: 'SecurePassword12!',
      });
    });

    expect(mockShowToast).toHaveBeenCalledWith({
      title: 'Account Activated',
      message: 'Your password has been created. You can now sign in.',
      durationMs: 15000,
    });
    expect(mockNavigate).toHaveBeenCalledWith('/signin', { replace: true });
  });

  it('shows an invalid state when activation parameters are missing', () => {
    renderActivation('/activate-account');

    expect(
      screen.getByRole('heading', { name: 'Invalid Activation Link' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Request New Password Link' }),
    ).toHaveAttribute('href', '/forgot-password');
    expect(authService.resetPassword).not.toHaveBeenCalled();
  });
});
