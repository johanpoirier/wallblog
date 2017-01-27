'use strict';

import serviceWorkerInstall from 'sw/install';

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function getSubscribtionStatus(registration) {
  return registration.pushManager.getSubscription().then(subscription => !(subscription === null));
}

function subscribeUser(registration) {
  const applicationServerKey = urlB64ToUint8Array(vapidPublicKey);

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
    .then(subscription => {
      return updateSubscriptionOnServer(subscription);
    })
    .catch(function (err) {
      console.error('Failed to subscribe the user: ', err);
      return false;
    });
}

function updateSubscriptionOnServer(subscription) {
  if (subscription) {
    return fetch('/api/push/subscribe', {
      method: 'post',
      body: JSON.stringify(subscription.toJSON())
    }).then(response => true);
  }
  return Promise.resolve(false);
}

export default {
  isUserSubscribed() {
    return serviceWorkerInstall().then(getSubscribtionStatus);
  },

  subscribeUser() {
    return serviceWorkerInstall().then(subscribeUser);
  }
};
