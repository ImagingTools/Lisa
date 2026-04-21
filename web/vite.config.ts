/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Bind to IPv4 explicitly: on some Windows setups `localhost` resolves to
    // IPv6 (::1) while Vite binds to IPv4 only, which makes http://localhost:5173
    // hang in the browser. 127.0.0.1 is resolved consistently on all platforms.
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    open: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
