const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const appName = import.meta.env.VITE_APP_NAME ?? 'Laravel API Base';
const appEnv = import.meta.env.VITE_APP_ENV ?? 'local';

if (!apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is not configured.');
}

export const env = {
  appName,
  apiBaseUrl,
  appEnv,
} as const;
