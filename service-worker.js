/* =========================================================
   日日安心 — Service Worker
   策略：
   - App 本體資源（HTML/CSS/JS/icons）採 cache-first，離線完整可用
   - Google Fonts 採 stale-while-revalidate（先給快取、背景更新）
   - 改版時更新 CACHE_VERSION 即可讓舊快取自動淘汰
   ========================================================= */

const CACHE_VERSION = 'v2.5.1';
const APP_CACHE = 'ri-ri-an-xin-app-' + CACHE_VERSION;
const FONT_CACHE = 'ri-ri-an-xin-fonts-' + CACHE_VERSION;

// 預先快取的 App 核心檔案（離線時必須存在的東西）
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './solar-lunar.js',
  './manifest.webmanifest',
  './icons/icon-192.png?v=2',
  './icons/icon-512.png?v=2',
  './icons/icon-192-maskable.png?v=2',
  './icons/icon-512-maskable.png?v=2',
  './icons/apple-touch-icon.png?v=2',
  './icons/favicon.png?v=2',
  './images/ui/countdown_calendar.jpg',
  './images/ui/qian_tube.png',
  './images/ui/qian_result.jpg',
  './images/ui/btn_play.png',
  './images/ui/btn_think.png',
  './images/ui/btn_move.png',
  './images/ui/btn_say.png',
  './images/ui/mood_good.png',
  './images/ui/mood_okay.png',
  './images/ui/mood_tired.png',
  './images/ui/mood_down.png',
  './images/ui/mood_sleepless.png',
  './images/ui/mood_lonely.png'
];

// ------------------ install: 預先快取 ------------------
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(APP_CACHE).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      // 立刻接管，不等舊版 SW 結束
      return self.skipWaiting();
    })
  );
});

// ------------------ activate: 清理舊版本快取 ------------------
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          // 保留當前版本，其餘清掉
          if (key !== APP_CACHE && key !== FONT_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// ------------------ fetch: 依資源類型分流 ------------------
self.addEventListener('fetch', function (event) {
  const request = event.request;

  // 只處理 GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Google Fonts: stale-while-revalidate
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(request, FONT_CACHE));
    return;
  }

  // 同源資源（App 本體）: cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request, APP_CACHE));
    return;
  }

  // 其他外部資源：直接走網路（不快取，避免污染）
});

// 快取優先：先看快取，沒有才打網路；網路抓到的也存起來
function cacheFirst(request, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (cached) {
      if (cached) return cached;

      return fetch(request).then(function (response) {
        // 只快取成功回應，且只快取基本/同源（避免 opaque 回應佔空間）
        if (response && response.status === 200 && response.type === 'basic') {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(function () {
        // 若是 navigation 請求（重新整理首頁失敗），回 fallback 首頁
        if (request.mode === 'navigate') {
          return cache.match('./index.html');
        }
        // 其餘失敗就讓它失敗
        return new Response('', { status: 504, statusText: 'Offline' });
      });
    });
  });
}

// 過期重驗：立刻給快取（如果有），同時背景去抓新版
function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (cached) {
      const fetchPromise = fetch(request).then(function (response) {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(function () {
        // 離線時若沒有快取就只能失敗，呼叫端會用 fallback 字體
        return cached;
      });
      return cached || fetchPromise;
    });
  });
}
