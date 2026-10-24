const CACHE_NAME = 'sancai-app-v6';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './favicon-32.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(()=>{})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then((networkResp) => {
      if (networkResp && networkResp.status === 200 && event.request.method === 'GET') {
        const respClone = networkResp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone));
      }
      return networkResp;
    }).catch(() => caches.match(event.request))
  );
});
