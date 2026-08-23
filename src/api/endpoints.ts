export const endpoints = {
  health: '/health',

  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
  },

  profile: {
    index: '/profile',
    avatar: '/profile/avatar',
  },

  users: {
    index: '/users',
    show: (id: string) => `/users/${id}`,
    restore: (id: string) => `/users/${id}/restore`,
    forceDelete: (id: string) => `/users/${id}/force`,
  },

  roles: {
    index: '/roles',
    show: (id: string) => `/roles/${id}`,
    permissions: '/roles/permissions',
    rolePermissions: (id: string) => `/roles/${id}/permissions`,
  },
} as const;
