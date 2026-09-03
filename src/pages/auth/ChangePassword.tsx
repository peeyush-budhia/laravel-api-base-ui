import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { authService } from '../../auth/authService';
import { useAuth } from '../../auth/useAuth';
import { usePasswordPolicy } from '../../hooks/usePasswordPolicy';
import { routes } from '../../routes/routes';
import { validatePassword } from '../../utils/passwordValidationUtils';
import {
  getApiErrorMessage,
  getApiFieldErrors,
} from '../../utils/apiErrorUtils';

import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import PageMeta from '../../components/common/PageMeta';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';

interface FieldErrors {
  current_password?: string[];
  password?: string[];
  password_confirmation?: string[];
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const {
    policy,
    isLoading: isPolicyLoading,
    error: policyError,
    reload: reloadPasswordPolicy,
  } = usePasswordPolicy();

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordValidation = useMemo(() => {
    if (!policy) {
      return null;
    }

    return validatePassword(password, policy);
  }, [password, policy]);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};

    if (!currentPassword.trim()) {
      errors.current_password = ['Current password is required.'];
    }

    if (!password.trim()) {
      errors.password = ['New password is required.'];
    } else if (policy && passwordValidation && !passwordValidation.valid) {
      const messages: string[] = [];

      if (!passwordValidation.minLength) {
        messages.push(
          `Password must be at least ${policy.min_length} characters.`,
        );
      }

      if (policy.require_mixed_case && !passwordValidation.mixedCase) {
        messages.push(
          'Password must contain at least one uppercase and one lowercase letter.',
        );
      }

      if (policy.require_numbers && !passwordValidation.numbers) {
        messages.push('Password must contain at least one number.');
      }

      if (policy.require_symbols && !passwordValidation.symbols) {
        messages.push('Password must contain at least one symbol.');
      }

      if (messages.length > 0) {
        errors.password = messages;
      }
    }

    if (!passwordConfirmation.trim()) {
      errors.password_confirmation = ['Please confirm your new password.'];
    } else if (password !== passwordConfirmation) {
      errors.password_confirmation = ['Passwords do not match.'];
    }

    return errors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setFieldErrors({});
    setGeneralError('');

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.changePassword({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });

      // Reload the authenticated user so that
      // must_change_password is updated to false.
      await refreshUser();

      navigate(routes.dashboard.home, { replace: true });
    } catch (error: unknown) {
      const apiErrors = getApiFieldErrors(error);
      setFieldErrors(apiErrors as FieldErrors);
      setGeneralError(
        Object.keys(apiErrors).length === 0
          ? getApiErrorMessage(error, 'Unable to change your password.')
          : '',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearPasswordErrors() {
    if (fieldErrors.password || fieldErrors.password_confirmation) {
      setFieldErrors((errors) => ({
        ...errors,
        password: undefined,
        password_confirmation: undefined,
      }));
    }
  }

  return (
    <>
      <PageMeta
        title="Change Password"
        description="Update your account password"
      />

      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 dark:bg-gray-950">
        <div className="w-full max-w-[520px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                Change Your Password
              </h1>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                You must change your password before continuing.
              </p>

              {user && (
                <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account: {user.email}
                </p>
              )}
            </div>

            {generalError && (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-error-500/20 bg-error-500/5 px-4 py-3 text-sm text-error-500"
              >
                {generalError}
              </div>
            )}

            <div className="mb-5">
              {isPolicyLoading ? (
                <LoadingState message="Loading password requirements..." />
              ) : policyError ? (
                <ErrorState
                  message={policyError}
                  onRetry={() => {
                    void reloadPasswordPolicy();
                  }}
                />
              ) : policy ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/30">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password requirements
                  </p>

                  <ul className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <li
                      className={
                        passwordValidation?.minLength
                          ? 'text-success-500'
                          : undefined
                      }
                    >
                      {passwordValidation?.minLength ? '✓' : '•'} At least{' '}
                      {policy.min_length} characters
                    </li>

                    {policy.require_mixed_case && (
                      <li
                        className={
                          passwordValidation?.mixedCase
                            ? 'text-success-500'
                            : undefined
                        }
                      >
                        {passwordValidation?.mixedCase ? '✓' : '•'} One
                        uppercase and one lowercase letter
                      </li>
                    )}

                    {policy.require_numbers && (
                      <li
                        className={
                          passwordValidation?.numbers
                            ? 'text-success-500'
                            : undefined
                        }
                      >
                        {passwordValidation?.numbers ? '✓' : '•'} At least one
                        number
                      </li>
                    )}

                    {policy.require_symbols && (
                      <li
                        className={
                          passwordValidation?.symbols
                            ? 'text-success-500'
                            : undefined
                        }
                      >
                        {passwordValidation?.symbols ? '✓' : '•'} At least one
                        symbol
                      </li>
                    )}
                  </ul>
                </div>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <Label htmlFor="current_password">
                  Current Password <span className="text-error-500">*</span>
                </Label>

                <Input
                  id="current_password"
                  name="current_password"
                  type="password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(event) => {
                    setCurrentPassword(event.target.value);

                    if (fieldErrors.current_password) {
                      setFieldErrors((errors) => ({
                        ...errors,
                        current_password: undefined,
                      }));
                    }
                  }}
                  disabled={isSubmitting}
                  error={Boolean(fieldErrors.current_password)}
                  hint={fieldErrors.current_password?.[0]}
                  aria-invalid={Boolean(fieldErrors.current_password)}
                  aria-describedby={
                    fieldErrors.current_password
                      ? 'current_password-hint'
                      : undefined
                  }
                />
              </div>

              <div>
                <Label htmlFor="password">
                  New Password <span className="text-error-500">*</span>
                </Label>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={
                    policy
                      ? `Enter at least ${policy.min_length} characters`
                      : 'Enter your new password'
                  }
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    clearPasswordErrors();
                  }}
                  disabled={isSubmitting}
                  error={Boolean(fieldErrors.password)}
                  hint={fieldErrors.password?.[0]}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={
                    fieldErrors.password ? 'password-hint' : undefined
                  }
                />
              </div>

              <div>
                <Label htmlFor="password_confirmation">
                  Confirm New Password <span className="text-error-500">*</span>
                </Label>

                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  placeholder="Confirm your new password"
                  value={passwordConfirmation}
                  onChange={(event) => {
                    setPasswordConfirmation(event.target.value);

                    if (fieldErrors.password_confirmation) {
                      setFieldErrors((errors) => ({
                        ...errors,
                        password_confirmation: undefined,
                      }));
                    }
                  }}
                  disabled={isSubmitting}
                  error={Boolean(fieldErrors.password_confirmation)}
                  hint={fieldErrors.password_confirmation?.[0]}
                  aria-invalid={Boolean(fieldErrors.password_confirmation)}
                  aria-describedby={
                    fieldErrors.password_confirmation
                      ? 'password_confirmation-hint'
                      : undefined
                  }
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full"
                  size="sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                        aria-hidden="true"
                      />
                      Updating Password...
                    </span>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </div>
            </form>

            <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-400">
              For security reasons, you cannot skip this step.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
