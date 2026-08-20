import type { User } from '../../types/user';

import { Modal } from '../ui/modal';

export type UserActionConfirmationType = 'delete' | 'restore' | 'force-delete';

interface UserActionConfirmationModalProps {
  user: User | null;
  action: UserActionConfirmationType;
  isSubmitting: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
}

interface ActionConfig {
  title: string;
  message: string;
  description: string;
  confirmLabel: string;
  submittingLabel: string;
}

const actionConfigs: Record<UserActionConfirmationType, ActionConfig> = {
  delete: {
    title: 'Delete User',
    message: 'Are you sure you want to delete',
    description: 'The user will be soft deleted and can be restored later.',
    confirmLabel: 'Delete User',
    submittingLabel: 'Deleting...',
  },

  restore: {
    title: 'Restore User',
    message: 'Are you sure you want to restore',
    description:
      'The user will be restored and become available as an active user.',
    confirmLabel: 'Restore User',
    submittingLabel: 'Restoring...',
  },

  'force-delete': {
    title: 'Permanently Delete User',
    message: 'Are you sure you want to permanently delete',
    description:
      'This action cannot be undone. The user and all associated data will be permanently deleted.',
    confirmLabel: 'Permanently Delete',
    submittingLabel: 'Deleting...',
  },
};

export default function UserActionConfirmationModal({
  user,
  action,
  isSubmitting,
  error,
  onClose,
  onConfirm,
}: UserActionConfirmationModalProps) {
  const config = actionConfigs[action];

  return (
    <Modal
      isOpen={user !== null}
      onClose={onClose}
      showCloseButton={!isSubmitting}
      className="max-w-md p-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {config.title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {config.message}{' '}
          <span className="font-medium text-gray-800 dark:text-white">
            {user?.full_name}
          </span>
          ?
        </p>

        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {config.description}
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-error-500/20 bg-error-500/5 px-4 py-3 text-sm text-error-500">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
              action === 'restore'
                ? 'bg-brand-500 hover:bg-brand-600'
                : 'bg-error-500 hover:bg-error-600'
            }`}
          >
            {isSubmitting ? config.submittingLabel : config.confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
