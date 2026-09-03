import type React from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

import { EyeCloseIcon, EyeIcon } from '../../icons';
import { useAuth } from '../../auth/useAuth';
import { routes } from '../../routes/routes';
import {
  getApiErrorMessage,
  getApiFieldErrors,
} from '../../utils/apiErrorUtils';

import Label from '../form/Label';
import Input from '../form/input/InputField';
import Checkbox from '../form/input/Checkbox';
import Button from '../ui/button/Button';

interface SignInLocationState {
  from?: {
    pathname: string;
    search?: string;
    hash?: string;
  };
}

interface ValidationErrors {
  login?: string[];
  password?: string[];
}

export default function SignInForm() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as SignInLocationState | null;

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setFieldErrors({});
    setGeneralError('');

    try {
      await login({
        login: loginValue,
        password,
        rememberMe: isChecked,
      });

      const destination = locationState?.from
        ? `${locationState.from.pathname}${locationState.from.search ?? ''}${locationState.from.hash ?? ''}`
        : routes.dashboard.home;

      navigate(destination, {
        replace: true,
      });
    } catch (error: unknown) {
      /*
       * apiClient normalizes Axios errors into ApiError.
       * Keep the form independent of Axios internals.
       */
      const apiErrors = getApiFieldErrors(error);
      if (Object.keys(apiErrors).length > 0) {
        setFieldErrors({
          login: apiErrors.login,
          password: apiErrors.password,
        });

        if (!apiErrors.login && !apiErrors.password) {
          setGeneralError(getApiErrorMessage(error));
        }

        return;
      }

      setGeneralError(
        getApiErrorMessage(error, 'Unable to sign in. Please try again.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-md pt-10" />

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 text-title-sm font-semibold text-gray-800 dark:text-white/90 sm:text-title-md">
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
                className="mb-5 rounded-lg border border-error-500/30 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400"
              >
                {generalError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-6">
                {/* Login */}
                <div>
                  <Label htmlFor="login">
                    Email <span className="text-error-500">*</span>
                  </Label>

                  <Input
                    id="login"
                    name="login"
                    type="email"
                    placeholder="info@gmail.com"
                    value={loginValue}
                    onChange={(event) => {
                      setLoginValue(event.target.value);

                      if (fieldErrors.login) {
                        setFieldErrors((current) => ({
                          ...current,
                          login: undefined,
                        }));
                      }
                    }}
                    disabled={isSubmitting}
                    error={Boolean(fieldErrors.login)}
                    hint={fieldErrors.login?.[0]}
                    aria-invalid={Boolean(fieldErrors.login)}
                    aria-describedby={
                      fieldErrors.login ? 'login-hint' : undefined
                    }
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">
                    Password <span className="text-error-500">*</span>
                  </Label>

                  {/*
                   * IMPORTANT:
                   * The eye button is positioned relative to the input's
                   * 44px field area, not the complete Input component.
                   *
                   * This keeps the icon vertically centered even when
                   * validation text appears underneath.
                   */}
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);

                        if (fieldErrors.password) {
                          setFieldErrors((current) => ({
                            ...current,
                            password: undefined,
                          }));
                        }
                      }}
                      disabled={isSubmitting}
                      error={Boolean(fieldErrors.password)}
                      hint={fieldErrors.password?.[0]}
                      className="pr-12"
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
                      className="absolute right-4 top-[22px] z-30 flex h-5 w-5 -translate-y-1/2 items-center justify-center disabled:cursor-not-allowed"
                    >
                      {showPassword ? (
                        <EyeIcon
                          className="size-5 fill-gray-500 dark:fill-gray-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <EyeCloseIcon
                          className="size-5 fill-gray-500 dark:fill-gray-400"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember / Forgot password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isChecked}
                      onChange={setIsChecked}
                      disabled={isSubmitting}
                    />

                    <span className="block text-theme-sm font-normal text-gray-700 dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>

                  <Link
                    to={routes.auth.forgotPassword}
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
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
                        Signing in...
                      </span>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
