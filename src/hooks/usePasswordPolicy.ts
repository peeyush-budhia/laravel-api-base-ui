import { useCallback, useEffect, useState } from 'react';

import { authService } from '../auth/authService';
import type { PasswordPolicy } from '../types/passwordPolicy';
import { getApiErrorMessage } from '../utils/apiErrorUtils';

interface UsePasswordPolicyResult {
  policy: PasswordPolicy | null;
  isLoading: boolean;
  error: string;
  reload: () => Promise<void>;
}

export function usePasswordPolicy(): UsePasswordPolicyResult {
  const [policy, setPolicy] = useState<PasswordPolicy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const passwordPolicy = await authService.getPasswordPolicy();

      setPolicy(passwordPolicy);
    } catch (error: unknown) {
      setError(
        getApiErrorMessage(error, 'Unable to load password requirements.'),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    authService
      .getPasswordPolicy()
      .then((passwordPolicy) => {
        if (cancelled) {
          return;
        }

        setPolicy(passwordPolicy);
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setError(
          getApiErrorMessage(error, 'Unable to load password requirements.'),
        );
      })
      .finally(() => {
        if (cancelled) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    policy,
    isLoading,
    error,
    reload,
  };
}
