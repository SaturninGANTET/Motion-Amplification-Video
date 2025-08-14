import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',  // Ensure PostCSS config is recognized by Vite
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',  // Target the backend running on localhost:3001
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),  // Optionally rewrite paths if necessary
      },
    },
  },
});