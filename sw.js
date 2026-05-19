// sw.js — RB Match Buddy
//   • Static assets (CSS, icons, manifest) → Cache-first
//   • HTML shell                           → Network-first with cache fallback
//   • Firebase / Firestore / Google APIs   → Pass-through 

const CACHE_NAME = 'rb-match-buddy-v1';

const STATIC_ASSETS = [
  './index.html',
  './style.css',
  './manifest.json',
  './icon/favicon.ico',
  './icon/icon-192.png',
  './icon/icon-512.png',
];

//No interception
const PASSTHROUGH_ORIGINS = [
  'firestore.googleapis.com',
  'firebase.googleapis.com',
  'firebaseapp.com',
  'gstatic.com',
  'googleapis.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// ── INSTALL: pre-cache static assets ──────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: remove old caches ───────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH ─────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. Always pass through Firebase/Google requests untouched
  if (PASSTHROUGH_ORIGINS.some(origin => url.hostname.includes(origin))) {
    return; 
  }

  // 2. Only handle GET requests
  if (event.request.method !== 'GET') return;

  const isHTML = event.request.headers.get('accept')?.includes('text/html')
              || url.pathname.endsWith('.html')
              || url.pathname === '/'
              || url.pathname.endsWith('/');

  if (isHTML) {
    // Network-first for HTML
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache-first for everything else (CSS, icons, fonts already cached by CDN)
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
  }
});
