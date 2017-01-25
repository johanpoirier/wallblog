window.WallBlog = {
  title: blogTitle
};
window.document.title = window.WallBlog.title;

import NotificationService from 'sw/install';
import AppRouter from 'router';

// create and initialize our router
new AppRouter();

// register service worker
const USER_ASKED_FOR_NOTIFICATIONS = 'userNotifcationsAsked';
NotificationService.isUserSubscribed().then(userSubscribed => {
  if (userSubscribed) {
    console.info('user is subscribed');
    return;
  }

  if (window.localStorage.getItem(USER_ASKED_FOR_NOTIFICATIONS) == 1) {
    console.info('the user has already been asked for notifications');
    return;
  }

  window.localStorage.setItem(USER_ASKED_FOR_NOTIFICATIONS, 1);
  if (window.confirm('Voulez-vous être notifié lors de l\'ajout de nouvelles photos sur le blog ?')) {
    NotificationService.subscribeUser();
  }
}).catch(console.warn);
