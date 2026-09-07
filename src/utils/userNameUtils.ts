export interface UserNameLike {
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}

export function getUserDisplayName(
  user: UserNameLike | null | undefined,
  fallback = 'User',
): string {
  if (!user) {
    return fallback;
  }

  return (
    user.full_name?.trim() ||
    [user.first_name, user.last_name].filter(Boolean).join(' ').trim() ||
    user.email?.trim() ||
    fallback
  );
}
