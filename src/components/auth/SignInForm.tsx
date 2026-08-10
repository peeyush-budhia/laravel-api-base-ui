import { useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { EyeCloseIcon, EyeIcon } from '../../icons';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Checkbox from '../form/input/Checkbox';
import Button from '../ui/button/Button';
import { useAuth } from '../../auth/useAuth';
import type { ApiErrorResponse } from '../../api/types';

interface ValidationErrors {
  login?: string[];
  password?: string[];
}

export default function SignInForm() {
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState('');

  const handleLoginChange = (value: string) => {
    setLoginValue(value);

    setFieldErrors((previous) => ({
      ...previous,
      login: undefined,
    }));

    setGeneralError('');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    setFieldErrors((previous) => ({
      ...previous,
      password: undefined,
    }));

    setGeneralError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setFieldErrors({});
    setGeneralError('');

    try {
      await login({
        login: loginValue,
        password,
      });
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const response = error.response;

        if (response?.status === 422) {
          const apiError = response.data;

          setFieldErrors({
            login: apiError.errors?.login,
            password: apiError.errors?.password,
          });

          if (!apiError.errors?.login && !apiError.errors?.password) {
            setGeneralError(
              apiError.message || 'Please check the information you entered.',
            );
          }

          return;
        }

        if (response?.data?.message) {
          setGeneralError(response.data.message);
          return;
        }
      }

      setGeneralError('Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          <div>
            {generalError && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400"
              >
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
                    type="email"
                    name="login"
                    placeholder="info@gmail.com"
                    value={loginValue}
                    onChange={(event) => handleLoginChange(event.target.value)}
                    disabled={isSubmitting}
                    error={Boolean(fieldErrors.login)}
                    hint={fieldErrors.login?.[0]}
                  />
                </div>

                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>

                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) =>
                        handlePasswordChange(event.target.value)
                      }
                      disabled={isSubmitting}
                      error={Boolean(fieldErrors.password)}
                      hint={fieldErrors.password?.[0]}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />

                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>

                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div>
                  <Button
                    className="w-full"
                    size="sm"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account?{' '}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
