import type React from 'react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

import { EyeCloseIcon, EyeIcon } from '../../icons';
import { authService } from '../../auth/authService';
import { routes } from '../../routes/routes';
import { usePasswordPolicy } from '../../hooks/usePasswordPolicy';
import { validatePassword } from '../../utils/passwordValidationUtils';
import {
  getApiErrorMessage,
  getApiFieldErrors,
} from '../../utils/apiErrorUtils';

import ErrorState from '../common/ErrorState';
import LoadingState from '../common/LoadingState';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';

interface ValidationErrors {
  token?: string[];
  email?: string[];
  password?: string[];
  password_confirmation?: string[];
}

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const {
    policy,
    isLoading: isPolicyLoading,
    error: policyError,
    reload: reloadPasswordPolicy,
  } = usePasswordPolicy();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordValidation = useMemo(() => {
    if (!policy) {
      return null;
    }

    return validatePassword(password, policy);
  }, [password, policy]);

  const clearFieldError = (field: keyof ValidationErrors) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      return {
        ...current,
        [field]: undefined,
      };
    });

    if (generalError) {
      setGeneralError('');
    }
  };

  const validate = (): ValidationErrors => {
    const errors: ValidationErrors = {};

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
  };

  const clearPasswordErrors = () => {
    setFieldErrors((current) => {
      if (!current.password && !current.password_confirmation) {
        return current;
      }

      return {
        ...current,
        password: undefined,
        password_confirmation: undefined,
      };
    });

    if (generalError) {
      setGeneralError('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setGeneralError('');

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await authService.resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setIsSuccess(true);
    } catch (error: unknown) {
      const apiError = getApiFieldErrors(error);

      if (Object.keys(apiError).length > 0) {
        const errors: ValidationErrors = {
          token: apiError.token,
          email: apiError.email,
          password: apiError.password,
          password_confirmation: apiError.password_confirmation,
        };

        setFieldErrors(errors);

        const hasFieldErrors = Object.values(errors).some(
          (value) => value && value.length > 0,
        );

        if (!hasFieldErrors) {
          setGeneralError(
            getApiErrorMessage(
              error,
              'Unable to reset your password. Please try again.',
            ),
          );
        }

        return;
      }

      setGeneralError(
        getApiErrorMessage(
          error,
          'Unable to reset your password. Please try again.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col flex-1">
        <div className="w-full max-w-md pt-10 mx-auto" />

        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Password Reset Successful
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your password has been reset successfully. You can now sign in
                with your new password.
              </p>
            </div>

            <div
              role="status"
              className="mb-5 rounded-lg border border-success-500/30 bg-success-50 px-4 py-3 text-sm text-success-600 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400"
            >
              Your password has been updated successfully.
            </div>

            <Link
              to={routes.auth.signIn}
              className="block w-full text-center text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="flex flex-col flex-1">
        <div className="w-full max-w-md pt-10 mx-auto" />

        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Invalid Reset Link
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                This password reset link is invalid or incomplete. Please
                request a new password reset link.
              </p>
            </div>

            <Link
              to={routes.auth.forgotPassword}
              className="block w-full text-center text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto" />

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Reset Password
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your new password below.
            </p>
          </div>

          {generalError && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-error-500/30 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400"
            >
              {generalError}
            </div>
          )}

          {isPolicyLoading ? (
            <div className="mb-6">
              <LoadingState message="Loading password requirements..." />
            </div>
          ) : policyError ? (
            <div className="mb-6">
              <ErrorState
                message={policyError}
                onRetry={() => {
                  void reloadPasswordPolicy();
                }}
              />
            </div>
          ) : policy ? (
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/30">
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
                    {passwordValidation?.mixedCase ? '✓' : '•'} One uppercase
                    and one lowercase letter
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

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">
              <div>
                <Label htmlFor="password">
                  New Password <span className="text-error-500">*</span>
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
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

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    disabled={isSubmitting}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="password_confirmation">
                  Confirm Password <span className="text-error-500">*</span>
                </Label>

                <div className="relative">
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    value={passwordConfirmation}
                    onChange={(event) => {
                      setPasswordConfirmation(event.target.value);
                      clearFieldError('password_confirmation');
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

                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswordConfirmation((value) => !value)
                    }
                    disabled={isSubmitting}
                    aria-label={
                      showPasswordConfirmation
                        ? 'Hide password'
                        : 'Show password'
                    }
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 disabled:cursor-not-allowed"
                  >
                    {showPasswordConfirmation ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
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
                      Resetting...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Remember your password?{' '}
              <Link
                to={routes.auth.signIn}
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
