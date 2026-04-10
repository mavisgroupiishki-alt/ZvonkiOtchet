const CACHE_NAME = 'mavis-calls-v3';
const ASSETS_TO_CACHE = [
  './manifest.json',
  './favicon.ico',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Never cache API calls or HTML pages
  if (url.hostname.includes('bitrix24') || url.hostname.includes('groq') || 
      url.hostname.includes('openrouter') || url.hostname.includes('anthropic') ||
      event.request.url.endsWith('.html') || event.request.url.endsWith('/')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
