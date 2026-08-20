import type { User } from '../../types/user';

interface UserAvatarProps {
  user: User;
}

export default function UserAvatar({ user }: UserAvatarProps) {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.full_name}
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
      {user.full_name.charAt(0).toUpperCase()}
    </div>
  );
}
