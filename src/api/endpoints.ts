export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    profile: '/profile',
    profileAvatar: '/profile/avatar',
  },

  users: {
    index: '/users',
  },

  roles: {
    index: '/roles',
  },
} as const;
