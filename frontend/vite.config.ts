import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }: { mode: string }) => {

  const env = loadEnv(mode, process.cwd(), ''); 
  const host = env.VITE_BACKEND_HOST?.replace(/^=+|=+$/g, '') || 'localhost';
  const port = env.VITE_BACKEND_PORT?.replace(/^=+|=+$/g, '') || '8080';
  const target = `http://${host}:${port}`;

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/products': {
          target,
          changeOrigin: true,
          secure: false,
        },
        '/products/': {
          target,
          changeOrigin: true,
          secure: false,
        },
        '/users': {
          target,
          changeOrigin: true,
          secure: false,
        },
        // Proxy requests starting with /api to the backend server
        '/api': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true, 
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      }
    }
  });
};
