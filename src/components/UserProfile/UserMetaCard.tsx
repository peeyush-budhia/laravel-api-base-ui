import { ChangeEvent, useRef, useState } from 'react';

import { useAuth } from '../../auth/useAuth';
import { authService } from '../../auth/authService';
import { userStatusColors, userStatusLabels } from '../../types/user';
import Badge from '../ui/badge/Badge';

export default function UserMetaCard() {
  const { user, refreshUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  if (!user) {
    return null;
  }

  const displayName = user.full_name || `${user.first_name} ${user.last_name}`;

  const avatarUrl = user.avatar;

  const initials =
    `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();

  const userStatusKey = (user.status ??
    'active') as keyof typeof userStatusColors;

  function handleAvatarClick() {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  }

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAvatarError('');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setAvatarError('Please select a JPG, PNG, or WebP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Avatar must not exceed 5 MB.');
      return;
    }

    setIsUploading(true);

    try {
      await authService.updateAvatar(file);
      await refreshUser();
    } catch (error: unknown) {
      const response = (
        error as {
          response?: {
            data?: {
              message?: string;
              errors?: {
                avatar?: string[];
              };
            };
          };
        }
      ).response;

      setAvatarError(
        response?.data?.errors?.avatar?.[0] ??
          response?.data?.message ??
          'Unable to update your avatar.',
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="relative">
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={isUploading}
              className="relative block w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 text-xl font-semibold text-blue-600 disabled:cursor-not-allowed"
              aria-label="Change profile picture"
            >
              {/* <span className="h-32 w-32 items-center rounded-full bg-brand-500 font-semibold text-white"> */}
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
              {/* </span> */}

              {isUploading && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={isUploading}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-500 text-white shadow-theme-xs dark:border-gray-900 disabled:opacity-50"
              aria-label="Change profile picture"
            >
              {/* camera SVG */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M9 4L10.5 2H13.5L15 4H19C20.1 4 21 4.9 21 6V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V6C3 4.9 3.9 4 5 4H9Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => void handleAvatarChange(event)}
              className="hidden"
            />
          </div>

          <div>
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {displayName}
            </h4>

            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.role ?? 'User'}
              </p>

              <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block" />

              <p className="text-sm text-gray-500 dark:text-gray-400">
                <Badge size="sm" color={userStatusColors[userStatusKey]}>
                  {userStatusLabels[userStatusKey]}
                </Badge>
              </p>
            </div>

            {avatarError && (
              <p className="mt-2 text-sm text-error-500">{avatarError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
