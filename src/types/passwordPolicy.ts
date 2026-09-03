import type { ApiResponse } from '../api/types';

export interface PasswordPolicy {
  min_length: number;
  require_mixed_case: boolean;
  require_numbers: boolean;
  require_symbols: boolean;
}

export type PasswordPolicyResponse = ApiResponse<PasswordPolicy>;
