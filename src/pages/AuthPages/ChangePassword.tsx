import { useState } from 'react';
import { useNavigate } from 'react-router';

import { authService } from '../../auth/authService';
import { useAuth } from '../../auth/useAuth';
import { routes } from '../../routes/routes';

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

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setFieldErrors({});
    setGeneralError('');

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
      const response = (
        error as {
          response?: {
            data?: {
              message?: string;
              errors?: FieldErrors;
            };
          };
        }
      ).response;

      setFieldErrors(response?.data?.errors ?? {});

      setGeneralError(
        response?.data?.message ?? 'Unable to change your password.',
      );
    } finally {
      setIsSubmitting(false);
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
              <div className="mb-5 rounded-lg border border-error-500/20 bg-error-500/5 px-4 py-3 text-sm text-error-500">
                {generalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  disabled={isSubmitting}
                  error={Boolean(fieldErrors.current_password)}
                  hint={fieldErrors.current_password?.[0]}
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
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  error={Boolean(fieldErrors.password)}
                  hint={fieldErrors.password?.[0]}
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
                  onChange={(event) =>
                    setPasswordConfirmation(event.target.value)
                  }
                  disabled={isSubmitting}
                  error={Boolean(fieldErrors.password_confirmation)}
                  hint={fieldErrors.password_confirmation?.[0]}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating Password...' : 'Update Password'}
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
