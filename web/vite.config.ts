/// <reference types="vitest" />
import { defineConfig, loadEnv, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '');

  // When pointing at a real Lisa server (`VITE_LISA_GRAPHQL_URL`), proxy the
  // request through the Vite dev server. The browser then sees a same-origin
  // request to `http://127.0.0.1:5173/<path>` and there is no CORS preflight
  // or `Access-Control-Allow-Origin` requirement on the upstream server.
  // The browser-side client (see `src/api/inlineHttpLink.ts`) sends to the
  // pathname only so this proxy can forward it.
  const proxy: Record<string, ProxyOptions> = {};
  const upstream = env.VITE_LISA_GRAPHQL_URL;
  if (upstream) {
    try {
      const parsed = new URL(upstream);
      proxy[parsed.pathname] = {
        target: `${parsed.protocol}//${parsed.host}`,
        changeOrigin: true,
        secure: false,
      };
    } catch {
      // Invalid URL — fall through; client will surface the error.
    }
  }

  return {
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
      proxy,
    },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
  };
});
