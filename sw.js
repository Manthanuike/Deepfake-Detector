// Service Worker for PWA
const CACHE_NAME = 'deepfake-detector-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Cache add error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Handle API requests (POST to /detect) - always go to network
  if (request.url.includes('/detect') || request.method !== 'GET') {
    event.respondWith(fetch(request));
    return;
  }

  // Cache first strategy for static assets
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request).then(fetchResponse => {
        // Cache successful responses
        if (fetchResponse && fetchResponse.status === 200) {
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return fetchResponse;
      }).catch(() => {
        // Return a cached fallback if available
        return caches.match(request);
      });
    })
  );
});
