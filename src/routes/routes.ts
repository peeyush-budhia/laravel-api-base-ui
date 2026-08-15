export const routes = {
  auth: {
    signIn: '/signin',
    signUp: '/signup',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },

  dashboard: {
    home: '/',
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
  },

  roles: {
    index: '/roles',
    create: '/roles/create',
    show: (id: string) => `/roles/${id}`,
    edit: (id: string) => `/roles/${id}/edit`,
  },

  settings: {
    index: '/settings',
  },
} as const;
