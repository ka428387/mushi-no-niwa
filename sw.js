/* 虫の音の庭 Service Worker
   静的ファイルだけの構成なので、初回に全部キャッシュしてオフラインで動くようにする。
   取り出しは cache-first、裏で取り直して次回起動時に新しくなる（stale-while-revalidate）。 */
const CACHE = 'mushi-no-niwa-v1';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(ASSETS.map(u =>
      cache.add(new Request(u, {cache: 'reload'})).catch(() => {})
    ));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, {ignoreSearch: true});
    const network = fetch(req).then(res => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    }).catch(() => null);

    if (cached) { e.waitUntil(network); return cached; }
    const res = await network;
    if (res) return res;
    if (req.mode === 'navigate') {
      return (await cache.match('./index.html')) ||
             new Response('オフラインです', {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}});
    }
    return new Response('', {status: 504});
  })());
});
