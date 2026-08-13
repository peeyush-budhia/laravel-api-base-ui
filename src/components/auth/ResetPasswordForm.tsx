import type React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router';

import { EyeCloseIcon, EyeIcon } from '../../icons';
import type { ApiErrorResponse } from '../../api/types';
import { authService } from '../../auth/authService';
import { routes } from '../../routes/routes';

import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';

interface ValidationErrors {
  token?: string[];
  email?: string[];
  password?: string[];
}

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setFieldErrors({});
    setGeneralError('');

    try {
      await authService.resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setIsSuccess(true);
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const response = error.response;

        if (response?.status === 422) {
          const apiError = response.data;

          setFieldErrors({
            token: apiError.errors?.token,
            email: apiError.errors?.email,
            password: apiError.errors?.password,
          });

          if (
            !apiError.errors?.token &&
            !apiError.errors?.email &&
            !apiError.errors?.password &&
            apiError.message
          ) {
            setGeneralError(apiError.message);
          }

          return;
        }

        if (response?.data?.message) {
          setGeneralError(response.data.message);
          return;
        }
      }

      setGeneralError('Unable to reset your password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col flex-1">
        <div className="w-full max-w-md pt-10 mx-auto"></div>

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

            <div className="mb-5 rounded-lg border border-success-500/30 bg-success-50 px-4 py-3 text-sm text-success-600 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400">
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
        <div className="w-full max-w-md pt-10 mx-auto"></div>

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
      <div className="w-full max-w-md pt-10 mx-auto"></div>

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
            <div className="mb-5 rounded-lg border border-error-500/30 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  New Password <span className="text-error-500">*</span>
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={isSubmitting}
                    error={Boolean(fieldErrors.password)}
                    hint={fieldErrors.password?.[0]}
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
                <Label>
                  Confirm Password <span className="text-error-500">*</span>
                </Label>

                <div className="relative">
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    value={passwordConfirmation}
                    onChange={(event) =>
                      setPasswordConfirmation(event.target.value)
                    }
                    disabled={isSubmitting}
                    error={Boolean(fieldErrors.password)}
                    hint={fieldErrors.password?.[0]}
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
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
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
