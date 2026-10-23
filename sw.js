/* D' Keys to Escaping — service worker.
 *
 * Safety rules (other games live on the same github.io site):
 *  - This file is registered with scope "./", so it only controls this repository's folder.
 *  - It only answers requests for URLs inside its own scope (plus the Google Fonts it uses).
 *  - Every cache it creates starts with "dkeys-", and it only ever deletes caches that start
 *    with "dkeys-". Caches belonging to other games are never touched.
 *
 * Bump VERSION whenever the game changes; the new worker installs, takes over, and old
 * "dkeys-" caches are removed, so a refresh shows the update.
 */
const VERSION = '3.0.0';
const PREFIX = 'dkeys-';
const CACHE = PREFIX + 'app-' + VERSION;
const FONT_CACHE = PREFIX + 'fonts-v1';
const SCOPE = self.registration.scope; // e.g. https://user.github.io/Typing-game/

const APP_FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/i18n.js', 'js/data.js', 'js/data2.js', 'js/store.js', 'js/art.js', 'js/game.js', 'js/ui.js',
  'js/songs.js', 'js/piano.js',
  // Piano Challenge samples (Salamander Grand Piano, see CREDITS.md)
  'audio/piano/A2.mp3', 'audio/piano/A3.mp3', 'audio/piano/A4.mp3', 'audio/piano/A5.mp3', 'audio/piano/A6.mp3', 'audio/piano/C2.mp3', 'audio/piano/C3.mp3',
  'audio/piano/C4.mp3', 'audio/piano/C5.mp3', 'audio/piano/C6.mp3', 'audio/piano/C7.mp3', 'audio/piano/Ds2.mp3', 'audio/piano/Ds3.mp3', 'audio/piano/Ds4.mp3',
  'audio/piano/Ds5.mp3', 'audio/piano/Ds6.mp3', 'audio/piano/Fs2.mp3', 'audio/piano/Fs3.mp3', 'audio/piano/Fs4.mp3', 'audio/piano/Fs5.mp3', 'audio/piano/Fs6.mp3',
  'data/verses-en.js', 'data/verses-es.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-192.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(APP_FILES.map(f => new Request(new URL(f, SCOPE), { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(k => k.startsWith(PREFIX) && k !== CACHE && k !== FONT_CACHE)
        .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = req.url;
  // Google Fonts: cache-first in our own font cache
  if (url.startsWith('https://fonts.googleapis.com/') || url.startsWith('https://fonts.gstatic.com/')) {
    event.respondWith(caches.open(FONT_CACHE).then(cache => cache.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
      return res;
    }).catch(() => hit))));
    return;
  }
  // Anything outside this game's folder is none of our business
  if (!url.startsWith(SCOPE)) return;
  // Network first (so updates show after a refresh), cache as the offline fallback
  event.respondWith(
    fetch(req).then(res => {
      if (res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then(cache => cache.put(req, copy));
      }
      return res;
    }).catch(() => caches.open(CACHE).then(cache =>
      cache.match(req, { ignoreSearch: true }).then(hit => hit || (req.mode === 'navigate' ? cache.match(new URL('index.html', SCOPE)) : undefined))
    ).then(hit => hit || Response.error()))
  );
});
