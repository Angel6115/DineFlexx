import { precacheAndRoute } from 'workbox-precaching';

// Escucha para activar nuevo SW automáticamente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Instalar
self.addEventListener('install', () => {
  console.log('[SW] Instalado');
});

// Activar
self.addEventListener('activate', (event) => {
  console.log('[SW] Activado');
  event.waitUntil(clients.claim());
});

// ¡Aquí es donde se inyectan los archivos de cacheo!
precacheAndRoute(self.__WB_MANIFEST);
