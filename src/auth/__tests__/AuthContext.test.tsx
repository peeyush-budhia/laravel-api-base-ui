import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { AuthProvider } from '../AuthContext';
import { authService } from '../authService';
import { useAuth } from '../useAuth';

import type { AuthUser } from '../types';

vi.mock('../authService', () => ({
  authService: {
    me: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

function AuthState() {
  const { user, isLoading } = useAuth();

  return (
    <div>
      <div>{isLoading ? 'loading' : 'ready'}</div>
      <div>{user?.email ?? 'no-user'}</div>
    </div>
  );
}

function renderAuthProvider(children: ReactNode) {
  return render(<AuthProvider>{children}</AuthProvider>);
}

class MockBroadcastChannel {
  static instances: MockBroadcastChannel[] = [];

  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  postMessage = vi.fn();
  close = vi.fn();

  constructor(readonly name: string) {
    MockBroadcastChannel.instances.push(this);
  }

  emit(data: unknown) {
    this.onmessage?.({ data } as MessageEvent<unknown>);
  }
}

const authenticatedUser: AuthUser = {
  id: '01993a3a-80c0-73d0-a03f-a811f9489c4a',
  first_name: 'Test',
  last_name: 'User',
  full_name: 'Test User',
  email: 'test@example.com',
  avatar: null,
  role: 'super-admin',
  permissions: [],
  status: 'active',
  email_verified_at: '2026-09-09T00:00:00.000000Z',
  last_login_at: null,
  created_at: '2026-09-09T00:00:00.000000Z',
  updated_at: '2026-09-09T00:00:00.000000Z',
  deleted_at: null,
};

describe('AuthProvider token lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    MockBroadcastChannel.instances = [];
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps the token when auth validation fails with a non-401 error', async () => {
    sessionStorage.setItem('access_token', 'session-token');

    vi.mocked(authService.me).mockRejectedValue({
      status: 500,
      message: 'Server error.',
      errors: null,
    });

    renderAuthProvider(<AuthState />);

    await waitFor(() => {
      expect(screen.getByText('ready')).toBeInTheDocument();
    });

    expect(screen.getByText('no-user')).toBeInTheDocument();
    expect(sessionStorage.getItem('access_token')).toBe('session-token');
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('clears the token when auth validation fails with 401', async () => {
    localStorage.setItem('access_token', 'local-token');

    vi.mocked(authService.me).mockRejectedValue({
      status: 401,
      message: 'Unauthenticated.',
      errors: null,
    });

    renderAuthProvider(<AuthState />);

    await waitFor(() => {
      expect(screen.getByText('ready')).toBeInTheDocument();
    });

    expect(screen.getByText('no-user')).toBeInTheDocument();
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(sessionStorage.getItem('access_token')).toBeNull();
  });

  it('restores an active non-remembered session from another open tab', async () => {
    vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);
    vi.mocked(authService.me).mockResolvedValue(authenticatedUser);

    renderAuthProvider(<AuthState />);

    const channel = MockBroadcastChannel.instances[0];

    expect(channel?.name).toBe('laravel-api-base-auth');
    expect(channel?.postMessage).toHaveBeenCalledWith({
      type: 'token-request',
    });

    act(() => {
      channel?.emit({ type: 'token-response', token: 'peer-session-token' });
    });

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    expect(sessionStorage.getItem('access_token')).toBe('peer-session-token');
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(authService.me).toHaveBeenCalledTimes(1);
  });

  it('shares its current session with a requesting tab', async () => {
    vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);
    sessionStorage.setItem('access_token', 'current-session-token');
    vi.mocked(authService.me).mockResolvedValue(authenticatedUser);

    renderAuthProvider(<AuthState />);

    const channel = MockBroadcastChannel.instances[0];

    act(() => {
      channel?.emit({ type: 'token-request' });
    });

    expect(channel?.postMessage).toHaveBeenCalledWith({
      type: 'token-response',
      token: 'current-session-token',
    });

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('applies logout from another tab using the same session', async () => {
    vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);
    sessionStorage.setItem('access_token', 'shared-session-token');
    vi.mocked(authService.me).mockResolvedValue(authenticatedUser);

    renderAuthProvider(<AuthState />);

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    const channel = MockBroadcastChannel.instances[0];

    act(() => {
      channel?.emit({ type: 'logout', token: 'shared-session-token' });
    });

    expect(screen.getByText('no-user')).toBeInTheDocument();
    expect(sessionStorage.getItem('access_token')).toBeNull();
  });
});
