import { describe, expect, it } from 'vitest';

import type { PasswordPolicy } from '../../types/passwordPolicy';
import { validatePassword } from '../passwordValidationUtils';

describe('validatePassword', () => {
  const basePolicy: PasswordPolicy = {
    min_length: 12,
    require_mixed_case: true,
    require_numbers: true,
    require_symbols: true,
  };

  it('passes when all password requirements are satisfied', () => {
    const result = validatePassword('SecurePassword12!', basePolicy);

    expect(result.minLength).toBe(true);
    expect(result.mixedCase).toBe(true);
    expect(result.numbers).toBe(true);
    expect(result.symbols).toBe(true);
    expect(result.valid).toBe(true);
  });

  it('fails when password is shorter than the configured minimum length', () => {
    const result = validatePassword('Short1!', basePolicy);

    expect(result.minLength).toBe(false);
    expect(result.valid).toBe(false);
  });

  it('fails when mixed case is required but missing', () => {
    const result = validatePassword('securepassword12!', basePolicy);

    expect(result.minLength).toBe(true);
    expect(result.mixedCase).toBe(false);
    expect(result.numbers).toBe(true);
    expect(result.symbols).toBe(true);
    expect(result.valid).toBe(false);
  });

  it('passes when mixed case is disabled by the backend policy', () => {
    const policy: PasswordPolicy = {
      ...basePolicy,
      require_mixed_case: false,
    };

    const result = validatePassword('securepassword12!', policy);

    expect(result.mixedCase).toBe(true);
    expect(result.valid).toBe(true);
  });

  it('fails when numbers are required but missing', () => {
    const result = validatePassword('SecurePassword!', basePolicy);

    expect(result.minLength).toBe(true);
    expect(result.mixedCase).toBe(true);
    expect(result.numbers).toBe(false);
    expect(result.symbols).toBe(true);
    expect(result.valid).toBe(false);
  });

  it('passes when numbers are disabled by the backend policy', () => {
    const policy: PasswordPolicy = {
      ...basePolicy,
      require_numbers: false,
    };

    const result = validatePassword('SecurePassword!', policy);

    expect(result.numbers).toBe(true);
    expect(result.valid).toBe(true);
  });

  it('fails when symbols are required but missing', () => {
    const result = validatePassword('SecurePassword12', basePolicy);

    expect(result.minLength).toBe(true);
    expect(result.mixedCase).toBe(true);
    expect(result.numbers).toBe(true);
    expect(result.symbols).toBe(false);
    expect(result.valid).toBe(false);
  });

  it('passes when symbols are disabled by the backend policy', () => {
    const policy: PasswordPolicy = {
      ...basePolicy,
      require_symbols: false,
    };

    const result = validatePassword('SecurePassword12', policy);

    expect(result.symbols).toBe(true);
    expect(result.valid).toBe(true);
  });

  it('passes when all optional requirements are disabled', () => {
    const policy: PasswordPolicy = {
      min_length: 12,
      require_mixed_case: false,
      require_numbers: false,
      require_symbols: false,
    };

    const result = validatePassword('abcdefghijkl', policy);

    expect(result.minLength).toBe(true);
    expect(result.mixedCase).toBe(true);
    expect(result.numbers).toBe(true);
    expect(result.symbols).toBe(true);
    expect(result.valid).toBe(true);
  });

  it('fails for an empty password when minimum length is required', () => {
    const result = validatePassword('', basePolicy);

    expect(result.minLength).toBe(false);
    expect(result.mixedCase).toBe(false);
    expect(result.numbers).toBe(false);
    expect(result.symbols).toBe(false);
    expect(result.valid).toBe(false);
  });

  it('uses the backend minimum length without hardcoding it', () => {
    const policy: PasswordPolicy = {
      ...basePolicy,
      min_length: 16,
    };

    const result = validatePassword('SecurePassword12!', policy);

    expect(result.minLength).toBe(true);
    expect(result.valid).toBe(true);
  });

  it('fails when only the minimum length requirement is not satisfied', () => {
    const policy: PasswordPolicy = {
      ...basePolicy,
      min_length: 20,
    };

    const result = validatePassword('SecurePassword12!', policy);

    expect(result.minLength).toBe(false);
    expect(result.mixedCase).toBe(true);
    expect(result.numbers).toBe(true);
    expect(result.symbols).toBe(true);
    expect(result.valid).toBe(false);
  });
});
