export const importMetaEnv = {
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'SMC',
  VITE_VERSION: import.meta.env.VITE_VERSION || '1.0.0',
};
