import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '../client';
import { profile } from '../profile';

vi.mock('../client', () => ({
  apiClient: {
    put: vi.fn(),
    post: vi.fn(),
  },
}));

describe('profileApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates the user profile', async () => {
    const user = {
      id: 'user-1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
    };

    const data = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '9876543210',
    };

    vi.mocked(apiClient.put).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Profile updated successfully.',
        data: user,
        errors: null,
      },
    });

    const response = await profile.updateProfile(data);

    expect(apiClient.put).toHaveBeenCalledWith('/profile', data);

    expect(response).toEqual(user);
  });

  it('updates the user avatar', async () => {
    const user = {
      id: 'user-1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      avatar: '/storage/avatars/user-1.jpg',
    };

    const file = new File(['avatar-content'], 'avatar.jpg', {
      type: 'image/jpeg',
    });

    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        success: true,
        status: 200,
        message: 'Avatar updated successfully.',
        data: user,
        errors: null,
      },
    });

    const response = await profile.updateAvatar(file);

    expect(apiClient.post).toHaveBeenCalledTimes(1);

    const [url, formData] = vi.mocked(apiClient.post).mock.calls[0];

    expect(url).toBe('/profile/avatar');

    expect(formData).toBeInstanceOf(FormData);
    expect((formData as FormData).get('avatar')).toBe(file);

    expect(response).toEqual(user);
  });
});
