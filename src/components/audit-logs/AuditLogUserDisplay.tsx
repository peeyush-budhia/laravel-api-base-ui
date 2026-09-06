import type { AuditLogUser } from '../../types/auditLog';
import UserAvatar from '../users/UserAvatar';
import { getUserDisplayName } from '../../utils/userNameUtils';

interface AuditLogUserDisplayProps {
  user: AuditLogUser | null;
}

export default function AuditLogUserDisplay({
  user,
}: AuditLogUserDisplayProps) {
  const displayName = getUserDisplayName(user, 'System');

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <UserAvatar
          user={{
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: user.full_name ?? displayName,
            email: user.email,
            avatar: user.avatar,
            role: null,
            permissions: [],
            status: 'active',
            must_change_password: false,
            email_verified_at: null,
            last_login_at: null,
            created_at: null,
            updated_at: null,
            deleted_at: null,
          }}
        />

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
            {displayName}
          </p>

          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        S
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
          {displayName}
        </p>

        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
          System action
        </p>
      </div>
    </div>
  );
}
