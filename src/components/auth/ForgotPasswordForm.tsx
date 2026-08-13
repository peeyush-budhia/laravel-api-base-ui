import type React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';

import type { ApiErrorResponse } from '../../api/types';
import { authService } from '../../auth/authService';
import { routes } from '../../routes/routes';

import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';

interface ValidationErrors {
  email?: string[];
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setFieldErrors({});
    setGeneralError('');
    setIsSuccess(false);

    try {
      await authService.forgotPassword(email);

      setIsSuccess(true);
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const response = error.response;

        if (response?.status === 422) {
          const apiError = response.data;

          setFieldErrors({
            email: apiError.errors?.email,
          });

          if (!apiError.errors?.email && apiError.message) {
            setGeneralError(apiError.message);
          }

          return;
        }

        if (response?.data?.message) {
          setGeneralError(response.data.message);
          return;
        }
      }

      setGeneralError('Unable to process your request. Please try again.');
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
                Check Your Email
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                If an account exists for that email address, a password reset
                link has been sent.
              </p>
            </div>

            <div className="mb-5 rounded-lg border border-success-500/30 bg-success-50 px-4 py-3 text-sm text-success-600 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400">
              Please check your email for instructions to reset your password.
            </div>

            <Link
              to={routes.auth.signIn}
              className="block w-full text-center text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Back to Sign In
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
              Forgot Password
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
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
                  Email <span className="text-error-500">*</span>
                </Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="info@gmail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting}
                  error={Boolean(fieldErrors.email)}
                  hint={fieldErrors.email?.[0]}
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  size="sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Wait, I remember my password...{' '}
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
