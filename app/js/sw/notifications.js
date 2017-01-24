const websiteUrl = 'websiteUrlPlaceholder';
const notificationTitle = 'notificationTitlePlaceholder';

self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: `${websiteUrl}/img/icon-144.png`,
    badge: `${websiteUrl}/img/icon-144.png`
  };

  event.waitUntil(self.registration.showNotification(notificationTitle, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(websiteUrl)
  );
});
