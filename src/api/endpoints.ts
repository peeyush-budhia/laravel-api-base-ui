export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
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
