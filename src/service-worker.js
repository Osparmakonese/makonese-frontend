/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

// This is required by CRA's workbox integration
const ignored = self.__WB_MANIFEST;

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
  }
});
