import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { AuthProvider } from '../AuthContext';
import { authService } from '../authService';
import { useAuth } from '../useAuth';

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

describe('AuthProvider token lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
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
});
