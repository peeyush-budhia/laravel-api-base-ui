import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';

import type { Role } from '../../types/role';

interface RoleActionConfirmationModalProps {
  role: Role | null;
  isSubmitting: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RoleActionConfirmationModal({
  role,
  isSubmitting,
  error,
  onClose,
  onConfirm,
}: RoleActionConfirmationModalProps) {
  if (!role) {
    return null;
  }

  return (
    <Modal
      isOpen={Boolean(role)}
      onClose={onClose}
      className="max-w-[500px] m-4"
    >
      <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
        <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Delete Role
        </h4>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to delete the role{' '}
          <span className="font-medium text-gray-800 dark:text-white/90">
            "{role.name}"
          </span>
          ?
        </p>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          This action cannot be undone.
        </p>

        {error && (
          <div className="mt-5 rounded-lg border border-error-500/20 bg-error-500/5 px-4 py-3 text-sm text-error-500">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-error-500 hover:bg-error-600"
          >
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
