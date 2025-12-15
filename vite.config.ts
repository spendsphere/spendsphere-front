import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    open: true,
    allowedHosts: ['spendsphere.ru', 'www.spendsphere.ru'],
    proxy: {
      '/api': {
        target: 'https://spendsphere.ru/api',
        changeOrigin: true,
        secure: false,
      },
      // Важно: НЕ проксируем /oauth2/callback — это фронтовый роут
      '/oauth2/authorization': {
        target: 'https://spendsphere.ru/api',
        changeOrigin: true,
        secure: false,
      },
      '/login': {
        target: 'https://spendsphere.ru/api',
        changeOrigin: true,
        secure: false,
      },
      '/logout': {
        target: 'https://spendsphere.ru/api',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

