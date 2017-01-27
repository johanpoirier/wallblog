'use strict';

let registration = null;

function getRegistration() {
  return new Promise((resolve, reject) => {
    if (!('serviceWorker' in navigator)) {
      return reject(new Error('Service workers aren\'t supported in this browser.'));
    }

    if (registration !== null) {
      return resolve(registration);
    }

    navigator.serviceWorker.register('./service-worker.js').then(swRegistration => {
      registration = swRegistration;
      resolve(registration);
    }).catch(reject);
  });
}

export default getRegistration;
