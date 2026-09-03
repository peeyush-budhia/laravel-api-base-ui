import type { PasswordPolicy } from '../types/passwordPolicy';

export interface PasswordValidationResult {
  minLength: boolean;
  mixedCase: boolean;
  numbers: boolean;
  symbols: boolean;
  valid: boolean;
}

export function validatePassword(
  password: string,
  policy: PasswordPolicy,
): PasswordValidationResult {
  const minLength = password.length >= policy.min_length;

  const mixedCase =
    !policy.require_mixed_case ||
    (/[a-z]/.test(password) && /[A-Z]/.test(password));

  const numbers = !policy.require_numbers || /\d/.test(password);

  const symbols = !policy.require_symbols || /[^A-Za-z0-9]/.test(password);

  return {
    minLength,
    mixedCase,
    numbers,
    symbols,
    valid: minLength && mixedCase && numbers && symbols,
  };
}
