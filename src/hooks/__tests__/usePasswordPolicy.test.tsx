import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import { authService } from '../../auth/authService';
import { usePasswordPolicy } from '../usePasswordPolicy';
import type { PasswordPolicy } from '../../types/passwordPolicy';

vi.mock('../../auth/authService', () => ({
  authService: {
    getPasswordPolicy: vi.fn(),
  },
}));

function TestComponent() {
  const { policy, isLoading, error, reload } = usePasswordPolicy();

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'loaded'}</div>
      <div data-testid="error">{error}</div>
      <div data-testid="min-length">{policy?.min_length ?? ''}</div>
      <div data-testid="mixed-case">
        {policy?.require_mixed_case ? 'true' : 'false'}
      </div>
      <div data-testid="numbers">
        {policy?.require_numbers ? 'true' : 'false'}
      </div>
      <div data-testid="symbols">
        {policy?.require_symbols ? 'true' : 'false'}
      </div>

      <button type="button" onClick={() => void reload()}>
        Reload
      </button>
    </div>
  );
}

describe('usePasswordPolicy', () => {
  const passwordPolicy: PasswordPolicy = {
    min_length: 12,
    require_mixed_case: true,
    require_numbers: true,
    require_symbols: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads the password policy successfully', async () => {
    vi.mocked(authService.getPasswordPolicy).mockResolvedValue(passwordPolicy);

    render(<TestComponent />);

    expect(screen.getByTestId('loading')).toHaveTextContent('loading');

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
    });

    expect(authService.getPasswordPolicy).toHaveBeenCalledTimes(1);

    expect(screen.getByTestId('error')).toHaveTextContent('');
    expect(screen.getByTestId('min-length')).toHaveTextContent('12');
    expect(screen.getByTestId('mixed-case')).toHaveTextContent('true');
    expect(screen.getByTestId('numbers')).toHaveTextContent('true');
    expect(screen.getByTestId('symbols')).toHaveTextContent('true');
  });

  it('handles password policy loading errors', async () => {
    vi.mocked(authService.getPasswordPolicy).mockRejectedValue(
      new Error('Unable to load password policy.'),
    );

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
    });

    expect(authService.getPasswordPolicy).toHaveBeenCalledTimes(1);

    expect(screen.getByTestId('error')).toHaveTextContent(
      'Unable to load password policy.',
    );

    expect(screen.getByTestId('min-length')).toHaveTextContent('');
  });

  it('reloads the password policy', async () => {
    const updatedPolicy: PasswordPolicy = {
      min_length: 16,
      require_mixed_case: false,
      require_numbers: true,
      require_symbols: false,
    };

    vi.mocked(authService.getPasswordPolicy)
      .mockResolvedValueOnce(passwordPolicy)
      .mockResolvedValueOnce(updatedPolicy);

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('min-length')).toHaveTextContent('12');
    });

    expect(authService.getPasswordPolicy).toHaveBeenCalledTimes(1);

    screen.getByRole('button', { name: 'Reload' }).click();

    await waitFor(() => {
      expect(screen.getByTestId('min-length')).toHaveTextContent('16');
    });

    expect(authService.getPasswordPolicy).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('mixed-case')).toHaveTextContent('false');
    expect(screen.getByTestId('numbers')).toHaveTextContent('true');
    expect(screen.getByTestId('symbols')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('clears a previous error when reload succeeds', async () => {
    vi.mocked(authService.getPasswordPolicy)
      .mockRejectedValueOnce(new Error('Request failed.'))
      .mockResolvedValueOnce(passwordPolicy);

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Request failed.');
    });

    screen.getByRole('button', { name: 'Reload' }).click();

    await waitFor(() => {
      expect(screen.getByTestId('min-length')).toHaveTextContent('12');
    });

    expect(screen.getByTestId('error')).toHaveTextContent('');
  });
});
