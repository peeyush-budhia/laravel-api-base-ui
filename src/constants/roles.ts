export const SUPER_ADMIN_ROLE = 'super-admin';

export function isProtectedRole(roleName: string): boolean {
  return roleName === SUPER_ADMIN_ROLE;
}
