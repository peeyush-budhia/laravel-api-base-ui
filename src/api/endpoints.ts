export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },

  users: {
    index: '/users',
  },

  roles: {
    index: '/roles',
  },
} as const;
