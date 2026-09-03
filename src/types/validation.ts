export type ValidationErrors = Record<string, string>;

export interface FieldValidationResult {
  valid: boolean;
  error?: string;
}
