const websiteUrl = 'websiteUrlPlaceholder';
const notificationTitle = 'notificationTitlePlaceholder';

self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: `${websiteUrl}/img/logo_m.png`,
    badge: `${websiteUrl}/img/logo_m.png`
  };

  event.waitUntil(self.registration.showNotification(notificationTitle, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(websiteUrl)
  );
});
