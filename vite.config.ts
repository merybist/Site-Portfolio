import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const port = Number(process.env.PORT || 3000);
const hmrHost = process.env.VITE_HMR_HOST;
const hmrProtocol = process.env.VITE_HMR_PROTOCOL || 'wss';
const hmrClientPort = Number(process.env.VITE_HMR_CLIENT_PORT || 443);

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['*'],
    host: '0.0.0.0',
    port,
    watch: {
      usePolling: true,
    },
    ...(hmrHost
      ? {
          hmr: {
            host: hmrHost,
            protocol: hmrProtocol,
            clientPort: hmrClientPort,
          },
        }
      : {}),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
