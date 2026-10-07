import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { generateSitemap, generateRobotsTxt } from './src/lib/seo.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl =
    env.VITE_SITE_URL && env.VITE_SITE_URL.trim() !== ''
      ? env.VITE_SITE_URL.trim().replace(/\/$/, '')
      : '[FILL: domain]';

  const siteMetaPlugin = {
    name: 'site-meta-plugin',
    transformIndexHtml(html) {
      return html.replace(/%SITE_URL%/g, siteUrl);
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: generateSitemap(siteUrl),
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: generateRobotsTxt(siteUrl),
      });
    },
  };

  return {
    plugins: [react(), tailwindcss(), siteMetaPlugin],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('framer-motion')) return 'motion';
              if (id.includes('three') || id.includes('@react-three')) return 'three';
              if (
                id.includes('react') ||
                id.includes('react-dom') ||
                id.includes('react-router')
              ) {
                return 'vendor';
              }
            }
          },
        },
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': { target: 'http://localhost:5000', changeOrigin: true },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.js',
      exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
    },
  };
});
