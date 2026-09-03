export const routes = {
  auth: {
    signIn: '/signin',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    changePassword: '/change-password',
  },

  dashboard: {
    home: '/dashboard',
  },

  auditLogs: {
    index: '/audit-logs',
    show: (id: string) => `/audit-logs/${id}`,
    showPattern: '/audit-logs/:id',
  },

  profile: {
    index: '/profile',
  },

  users: {
    index: '/users',
    create: '/users/create',
    show: (id: string) => `/users/${id}`,
    showPattern: '/users/:id',
    edit: (id: string) => `/users/${id}/edit`,
    editPattern: '/users/:id/edit',
  },

  roles: {
    index: '/roles',
    create: '/roles/create',
    show: (id: string) => `/roles/${id}`,
    showPattern: '/roles/:id',
    edit: (id: string) => `/roles/${id}/edit`,
    editPattern: '/roles/:id/edit',
    permissions: (id: string) => `/roles/${id}/permissions`,
    permissionsPattern: '/roles/:id/permissions',
  },

  error: {
    unauthorized: '/unauthorized',
  },
} as const;
