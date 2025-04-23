import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/frontend/', // Set the base path
  server: {
    port: 5173, // Set the server port
    // No proxy configuration needed
  }
});
