/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

// KILL-SHIM: this service worker exists only to undo prior CRA Workbox registrations.
// Previous versions precached index.html + static chunks and served stale bundles to
// returning users after Vercel rotated hashed filenames (Osy hit this on 2026-04-23
// — Sprint 1 Loss Prevention changes weren't visible until his SW was manually unregistered).
// On install, this SW claims all clients, wipes every Cache Storage entry, unregisters
// itself, and reloads active windows so they pick up the fresh Vercel build.

// CRA's workbox plugin still injects the precache manifest; we deliberately ignore it.
const ignored = self.__WB_MANIFEST;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) {
      // swallow — best effort
    }
    try {
      await self.registration.unregister();
    } catch (e) {
      // swallow
    }
    try {
      const windowClients = await self.clients.matchAll({ type: 'window' });
      windowClients.forEach((c) => {
        try { c.navigate(c.url); } catch (e) { /* noop */ }
      });
    } catch (e) {
      // swallow
    }
  })());
});

// Deliberately no fetch handler — we want the browser to go straight to the network
// while this SW is still active, not serve stale precache. Once activate() runs the
// SW is unregistered anyway.
// v2 — kill-shim reconfirmed 2026-04-23.
