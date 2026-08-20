export const permissions = {
  rolesView: 'roles.view',
  rolesCreate: 'roles.create',
  rolesUpdate: 'roles.update',
  rolesDelete: 'roles.delete',
  rolesManagePermissions: 'roles.manage-permissions',

  usersView: 'users.view',
  usersCreate: 'users.create',
  usersUpdate: 'users.update',
  usersDelete: 'users.delete',
  usersRestore: 'users.restore',
} as const;

export type Permission = (typeof permissions)[keyof typeof permissions];
