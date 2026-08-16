export const permissions = {
  usersView: 'users.view',
  usersCreate: 'users.create',
  usersUpdate: 'users.update',
  usersDelete: 'users.delete',
  usersRestore: 'users.restore',
  usersChangeStatus: 'users.change-status',
} as const;

export type Permission = (typeof permissions)[keyof typeof permissions];
