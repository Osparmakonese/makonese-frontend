const CACHE = "makonese-v1";
const OFFLINE_ASSETS = ["/", "/index.html", "/manifest.json", "/logo192.png", "/favicon.ico"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(OFFLINE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.hostname.includes("railway.app")) {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response(JSON.stringify({ offline: true, message: "You are offline. Data will sync when reconnected." }),
          { headers: { "Content-Type": "application/json" } })
      )
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match("/index.html"));
    })
  );
});

self.addEventListener("sync", e => {
  if (e.tag === "sync-queue") {
    e.waitUntil(self.clients.matchAll().then(clients =>
      clients.forEach(c => c.postMessage({ type: "SYNC_QUEUE" }))
    ));
  }
});

// --- Web Push handler (#7 notifications) ---
self.addEventListener("push", e => {
  let data = { title: "Makonese Farm", body: "New alert", url: "/" };
  try {
    if (e.data) data = { ...data, ...e.data.json() };
  } catch (_) {
    if (e.data) data.body = e.data.text();
  }
  const opts = {
    body: data.body,
    icon: "/logo192.png",
    badge: "/logo192.png",
    data: { url: data.url || "/" },
    tag: data.tag || "farm-alert",
    renotify: true,
  };
  e.waitUntil(self.registration.showNotification(data.title, opts));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clients => {
      for (const c of clients) {
        if ("focus" in c) { c.navigate(url); return c.focus(); }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
