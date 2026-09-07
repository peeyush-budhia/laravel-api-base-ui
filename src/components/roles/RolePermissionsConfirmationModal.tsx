import Button from '../ui/button/Button';
import { Modal } from '../ui/modal';

interface RolePermissionsConfirmationModalProps {
  isOpen: boolean;
  roleName: string;
  permissionCount: number;
  isSubmitting: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RolePermissionsConfirmationModal({
  isOpen,
  roleName,
  permissionCount,
  isSubmitting,
  error,
  onClose,
  onConfirm,
}: RolePermissionsConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
      <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
        <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Confirm Permission Changes
        </h4>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to sync the selected permissions for{' '}
          <span className="font-medium text-gray-800 dark:text-white/90">
            "{roleName}"
          </span>
          ?
        </p>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          This will update {permissionCount}{' '}
          {permissionCount === 1 ? 'permission' : 'permissions'} for the role.
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
            className="bg-brand-500 hover:bg-brand-600"
          >
            {isSubmitting ? 'Saving...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
