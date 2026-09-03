export const permissions = {
  dashboard: {
    view: 'dashboard.view',
  },

  auditLogs: {
    view: 'audit-logs.view',
  },

  users: {
    view: 'users.view',
    create: 'users.create',
    update: 'users.update',
    delete: 'users.delete',
    restore: 'users.restore',
  },

  roles: {
    view: 'roles.view',
    create: 'roles.create',
    update: 'roles.update',
    delete: 'roles.delete',
    managePermissions: 'roles.manage-permissions',
  },
} as const;

type PermissionValues<T> = T extends string
  ? T
  : T extends Record<string, infer V>
    ? V extends string
      ? V
      : PermissionValues<V>
    : never;

export type Permission = PermissionValues<typeof permissions>;
