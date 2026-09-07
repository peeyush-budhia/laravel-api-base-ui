import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import UserInfoCard from '../UserInfoCard';
import UserMetaCard from '../UserMetaCard';
import { profile } from '../../../api/profile';
import { useAuth } from '../../../auth/useAuth';
import type { AuthUser } from '../../../auth/types';
import { usePasswordPolicy } from '../../../hooks/usePasswordPolicy';
import { useToast } from '../../common/useToast';

vi.mock('../../../api/profile', () => ({
  profile: {
    updateProfile: vi.fn(),
    updateAvatar: vi.fn(),
  },
}));

vi.mock('../../../auth/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../../hooks/usePasswordPolicy', () => ({
  usePasswordPolicy: vi.fn(),
}));

vi.mock('../../common/useToast', () => ({
  useToast: vi.fn(),
}));

function createUser(): AuthUser {
  return {
    id: 'user-1',
    first_name: 'John',
    last_name: 'Doe',
    full_name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    role: 'Administrator',
    permissions: [],
    status: 'active',
    email_verified_at: null,
    last_login_at: null,
    created_at: null,
    updated_at: null,
    deleted_at: null,
  };
}

describe('Profile cards', () => {
  const refreshUser = vi.fn();
  const showToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      user: createUser(),
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser,
    });

    vi.mocked(useToast).mockReturnValue({
      showToast,
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
  });

  it('shows a toast after updating the profile information', async () => {
    vi.mocked(profile.updateProfile).mockResolvedValue(createUser());

    render(<UserInfoCard />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    fireEvent.change(screen.getByLabelText('First Name *'), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText('Last Name *'), {
      target: { value: 'Smith' },
    });
    fireEvent.change(screen.getByLabelText('Email Address *'), {
      target: { value: 'jane@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(profile.updateProfile).toHaveBeenCalledWith({
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
      });
    });

    expect(refreshUser).toHaveBeenCalledTimes(1);
    expect(showToast).toHaveBeenCalledWith({
      title: 'Profile Updated',
      message: 'Profile information updated successfully.',
    });
  });

  it('shows a toast and clears the file input after updating the avatar', async () => {
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });

    vi.mocked(profile.updateAvatar).mockResolvedValue(createUser());

    const { container } = render(<UserMetaCard />);
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement | null;

    expect(fileInput).toBeTruthy();

    fireEvent.change(fileInput!, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(profile.updateAvatar).toHaveBeenCalledWith(file);
    });

    expect(refreshUser).toHaveBeenCalledTimes(1);
    expect(showToast).toHaveBeenCalledWith({
      title: 'Avatar Updated',
      message: 'Profile picture updated successfully.',
    });
    expect(fileInput?.value).toBe('');
  });
});
