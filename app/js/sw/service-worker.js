const config = {
  version: 'CURRENT_VERSION',
  websiteUrl: 'WEBSITE_URL',
  notificationTitle: 'NOTIFICATION_TITLE',
  staticCacheItems: [
    '/img/logo.png',
    '/img/timeline-white.png',
    '/css/main.css',
    '/js/wallblog.js',
    '/font/handyhandy-webfont.eot',
    '/font/handyhandy-webfont.ttf',
    '/font/handyhandy-webfont.svg',
    '/font/handyhandy-webfont.woff',
    '/font/handyhandy-webfont.woff2',
    '/font/sansation_regular-webfont.eot',
    '/font/sansation_regular-webfont.svg',
    '/font/sansation_regular-webfont.ttf',
    '/font/sansation_regular-webfont.woff',
    '/font/wallblog.eot',
    '/font/wallblog.svg',
    '/font/wallblog.ttf',
    '/font/wallblog.woff',
    '/font/wallblog.woff2',
    '/'
  ],
  cachePathPattern: /^\/(?:(font|css|img|js|api|pictures)\/(.+)?)?$/
};

self.addEventListener('install', event => {
  function onInstall(event, opts) {
    const cacheKey = cacheName('static', opts);
    return caches.open(cacheKey).then(cache => cache.addAll(opts.staticCacheItems));
  }

  event.waitUntil(onInstall(event, config).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  function onActivate(event, opts) {
    return caches.keys()
      .then(cacheKeys => {
        const oldCacheKeys = cacheKeys.filter(key => key.indexOf(opts.version) !== 0);
        const deletePromises = oldCacheKeys.map(oldKey => caches.delete(oldKey));
        return Promise.all(deletePromises);
      });
  }

  event.waitUntil(onActivate(event, config).then(() => self.clients.claim()));
});

self.addEventListener('push', function (event) {
  const options = {
    body: event.data.text(),
    icon: `${config.websiteUrl}/img/notification-icon-144.png`,
    badge: `${config.websiteUrl}/img/logo.png`
  };

  event.waitUntil(self.registration.showNotification(config.notificationTitle, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(config.websiteUrl));
});


self.addEventListener('fetch', event => {

  function shouldHandleFetch(event, opts) {
    const request = event.request;
    const url = new URL(request.url);
    const criteria = {
      matchesPathPattern: opts.cachePathPattern.test(url.pathname),
      isGETRequest: request.method === 'GET',
      isFromMyOrigin: url.origin === self.location.origin
    };
    const failingCriteria = Object.keys(criteria).filter(criteriaKey => !criteria[criteriaKey]);
    return !failingCriteria.length;
  }

  function onFetch(event, opts) {
    const request = event.request;

    if (request.url.indexOf('/api') > 0) {
      event.respondWith(
        fetch(request)
          .then(response => addToCache(cacheName('api', opts), request, response))
          .catch(() => fetchFromCache(request))
          .catch(() => offlineResponse())
      );
    } else if (request.url.indexOf('/pictures') > 0) {
      event.respondWith(
        fetch(request)
          .then(response => addPictureToCache(cacheName('pictures', opts), request, response))
          .catch(() => fetchPictureFromCache(request))
          .catch(() => offlineResponse())
      );
    } else {
      event.respondWith(
        fetchFromCache(event)
          .catch(() => fetch(request))
          .then(response => addToCache(cacheName('static', opts), request, response))
          .catch(() => offlineResponse())
      );
    }
  }

  if (shouldHandleFetch(event, config)) {
    onFetch(event, config);
  }

});


function cacheName(key, opts) {
  return `${opts.version}-${key}`;
}

function addToCache(cacheKey, request, response) {
  if (response.ok) {
    const copy = response.clone();
    caches.open(cacheKey).then(cache => {
      cache.put(request, copy);
    });
  }
  return response;
}

function addPictureToCache(cacheKey, request, response) {
  if (isHiResPictureUrl(request.url) && response.ok) {
    return addToCache(cacheKey, request, response);
  } else {
    const hiResPictureUrl = getHiResPictureUrl(request.url);
    fetch(hiResPictureUrl)
      .then(response => addToCache(cacheKey, hiResPictureUrl, response))
      .catch(error => console.log(error));
  }
  return response;
}

function fetchFromCache(request) {
  return caches.match(request).then(response => {
    if (!response) {
      throw Error(`${request.url || request} not found in cache`);
    }
    return response;
  });
}

function fetchPictureFromCache(request) {
  return fetchFromCache(getHiResPictureUrl(request.url));
}

function offlineResponse() {
  return new Response();
}

function isHiResPictureUrl(url) {
  return url.indexOf('--1600') > 0;
}

function getHiResPictureUrl(url) {
  if (url.match(/--(\d+)/)) {
    return url.replace(/--(\d+)/, '--1600');
  }
  return url.replace(/\.([a-zA-Z]+)$/, '--1600.$1');
}
