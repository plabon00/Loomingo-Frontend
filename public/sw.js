// Minimal Service Worker required for PWA installation criteria
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through fetch handler satisfies the browser's PWA checks
  event.respondWith(fetch(event.request));
});
