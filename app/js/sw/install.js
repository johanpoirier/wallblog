'use strict';

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

function initialiseUI(swRegistration) {
  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
    .then(function(subscription) {
      let isSubscribed = !(subscription === null);

      if (isSubscribed) {
        console.log('User IS subscribed.');
      } else {
        console.log('User is NOT subscribed.');
        subscribeUser(swRegistration);
      }
    });
}

function subscribeUser(swRegistration) {
  const applicationServerKey = urlB64ToUint8Array(vapidPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
    .then(function(subscription) {
      console.log('User is subscribed:', subscription);

      updateSubscriptionOnServer(subscription);

      return true;
    })
    .catch(function(err) {
      console.log('Failed to subscribe the user: ', err);
    });
}

function updateSubscriptionOnServer(subscription) {
  if (subscription) {
    fetch('/api/push/subscribe', {
      method: 'post',
      body: JSON.stringify(subscription.toJSON())
    }).then(response => {
      console.log(response);
    });
  }
}

export default function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw/notifications.js').then(function(reg) {
      if(reg.installing) {
        console.log('Service worker installing');
      } else if(reg.waiting) {
        console.log('Service worker installed');
      } else if(reg.active) {
        console.log('Service worker active');
      }

      initialiseUI(reg);

      return true;
    });
  } else {
    console.log('Service workers aren\'t supported in this browser.');
    return false;
  }
};
