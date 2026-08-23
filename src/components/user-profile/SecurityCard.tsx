import { useState } from 'react';

import { authService } from '../../auth/authService';
import { useAuth } from '../../auth/useAuth';

import { useModal } from '../../hooks/useModal';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';

interface FieldErrors {
  current_password?: string[];
  password?: string[];
  password_confirmation?: string[];
}

export default function ProfileChangePasswordCard() {
  const { refreshUser } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleOpen() {
    setCurrentPassword('');
    setPassword('');
    setPasswordConfirmation('');

    setFieldErrors({});
    setGeneralError('');
    setIsSuccess(false);

    openModal();
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    closeModal();
    setFieldErrors({});
    setGeneralError('');
    setIsSuccess(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setFieldErrors({});
    setGeneralError('');
    setIsSuccess(false);

    setIsSubmitting(true);

    try {
      await authService.changePassword({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });

      await refreshUser();

      setCurrentPassword('');
      setPassword('');
      setPasswordConfirmation('');

      setIsSuccess(true);
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
        response?.data?.message ??
          'Unable to change your password. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Password
            </h4>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Update your password to keep your account secure.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpen}
            className="flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-white lg:w-auto"
          >
            Change Password
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        showCloseButton={!isSubmitting}
        className="max-w-[600px] m-4"
      >
        <div className="relative w-full rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          <div className="px-2 pr-12">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Change Password
            </h4>

            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Enter your current password and choose a new password.
            </p>
          </div>

          <div className="px-2">
            {generalError && (
              <div className="mb-5 rounded-lg border border-error-500/20 bg-error-500/5 px-4 py-3 text-sm text-error-500">
                {generalError}
              </div>
            )}

            {isSuccess && (
              <div className="mb-5 rounded-lg border border-success-500/20 bg-success-500/5 px-4 py-3 text-sm text-success-600 dark:text-success-400">
                Your password has been changed successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="profile_current_password">
                  Current Password <span className="text-error-500">*</span>
                </Label>

                <Input
                  id="profile_current_password"
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
                <Label htmlFor="profile_password">
                  New Password <span className="text-error-500">*</span>
                </Label>

                <Input
                  id="profile_password"
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
                <Label htmlFor="profile_password_confirmation">
                  Confirm New Password <span className="text-error-500">*</span>
                </Label>

                <Input
                  id="profile_password_confirmation"
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

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>

                <Button type="submit" size="sm" disabled={isSubmitting}>
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
          </div>
        </div>
      </Modal>
    </>
  );
}
