import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/documentary-doublets/',
  plugins: [
    react(),
    {
      name: 'strip-csp-meta-dev',
      transformIndexHtml: {
        order: 'pre',
        handler(html, { server }) {
          if (server) {
            // In dev mode, the HTTP response header CSP (with 'unsafe-inline') is used instead.
            // Keeping the meta tag would make both policies apply simultaneously, with the
            // more restrictive meta tag blocking Vite's dynamic style injection.
            return html.replace(/<meta[^>]*http-equiv="Content-Security-Policy"[^>]*\/?>/i, '');
          }
          return html;
        },
      },
    },
  ],
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline'; worker-src 'self' blob:; connect-src 'self' https://www.sefaria.org; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; frame-ancestors 'none';",
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/react-app-env.d.ts',
        'src/setupTests.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
      ],
      reporter: ['text', 'html'],
    },
  },
});
