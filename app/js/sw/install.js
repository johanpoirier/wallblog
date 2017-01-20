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

      return true;
    });
  } else {
    console.log('Service workers aren\'t supported in this browser.');
    return false;
  }
};
