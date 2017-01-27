const config = {
  version: 'CURRENT_VERSION',
  websiteUrl: 'WEBSITE_URL',
  notificationTitle: 'NOTIFICATION_TITLE'
};

self.addEventListener('install', event => {
  function onInstall (event, opts) {
    return Promise.resolve();
  }

  event.waitUntil(onInstall(event, config).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  function onActivate (event, opts) {
    return Promise.resolve();
  }

  event.waitUntil(onActivate(event, config).then(() => self.clients.claim()));
});

self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: `${config.websiteUrl}/img/notification-icon-144.png`,
    badge: `${config.websiteUrl}/img/logo.png`
  };

  event.waitUntil(self.registration.showNotification(config.notificationTitle, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(config.websiteUrl));
});
