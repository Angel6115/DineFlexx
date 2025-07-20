import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      srcDir: 'src',
      filename: 'custom-sw.js',
      strategies: 'injectManifest',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,woff2,ttf}'],
      },
      manifest: {
        name: 'DineFlexx',
        short_name: 'DineFlexx',
        description: 'Gestiona restaurantes, pedidos y más',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'icons/pwa-192x192.png',
        'icons/pwa-512x512.png',
      ],
    }),
  ],
  server: {
    port: 3000, // 👈 Este es el cambio clave
    historyApiFallback: true,
  },
  build: {
    sourcemap: true,
  },
});
