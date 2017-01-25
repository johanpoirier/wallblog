'use strict';

let registration = null;

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
      console.log('User is subscribed:', subscription);
      return updateSubscriptionOnServer(subscription);
    })
    .catch(function (err) {
      console.log('Failed to subscribe the user: ', err);
      return false;
    });
}

function updateSubscriptionOnServer(subscription) {
  if (subscription) {
    return fetch('/api/push/subscribe', {
      method: 'post',
      body: JSON.stringify(subscription.toJSON())
    }).then(response => console.log(response));
  }
  return false;
}

function getRegistration() {
  return new Promise((resolve, reject) => {
    if (!('serviceWorker' in navigator)) {
      return reject(new Error('Service workers aren\'t supported in this browser.'));
    }

    if (registration !== null) {
      return resolve(registration);
    }
    navigator.serviceWorker.register(`./notifications.${hash}.js`).then(swRegistration => {
      registration = swRegistration;
      resolve(registration);
    });
  });
}

export default {
  isUserSubscribed() {
    return getRegistration().then(getSubscribtionStatus);
  },

  subscribeUser() {
    return getRegistration().then(subscribeUser);
  }
};
