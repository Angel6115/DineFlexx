/* global self, workbox */
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precarga todos los assets compilados
precacheAndRoute(self.__WB_MANIFEST);

// Navegación SPA
registerRoute(
  new NavigationRoute(async () => {
    return await caches.match('/index.html');
  })
);

// Cache First para estáticos (imágenes, JS, CSS, fuentes)
registerRoute(
  /\.(?:js|css|png|jpg|jpeg|svg|ico|webp|ttf|woff2?)$/,
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
      }),
    ],
  })
);

// Network First para llamadas a Supabase
registerRoute(
  ({ url }) => url.origin.includes('supabase.co'),
  new NetworkFirst({
    cacheName: 'api-calls',
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutos
      }),
    ],
  })
);

// Documentos HTML (como fallback de rutas)
registerRoute(
  ({ request }) => request.destination === 'document',
  new StaleWhileRevalidate({
    cacheName: 'html-cache',
  })
);

// Activación automática del nuevo SW
self.addEventListener('install', (event) => self.skipWaiting());
self.addEventListener('activate', (event) => self.clients.claim());
