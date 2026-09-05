import { getUserDisplayName, type UserNameLike } from './userNameUtils';

export function getResourceName(type: string): string {
  return type.split('\\').pop() ?? 'Unknown';
}

export function getDisplayName(
  user: UserNameLike | null | undefined,
  fallback = 'User',
): string {
  return getUserDisplayName(user, fallback);
}

export function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('');

  return initials ? initials.toUpperCase() : 'U';
}
