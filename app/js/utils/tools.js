const LAST_LOGIN_KEY = "lastLogin";

const isLogged = () => {
  let lastLogin = 0;
  if (window.sessionStorage) {
    lastLogin = window.sessionStorage.getItem(LAST_LOGIN_KEY);
  }
  else {
    lastLogin = window.lastLogin;
  }
  return (lastLogin != 0) && ((Date.now() - lastLogin) < 3600000);
};

const setLoggedTime = () => {
  let now = Date.now();
  if (window.sessionStorage) {
    window.sessionStorage.setItem(LAST_LOGIN_KEY, now);
  }
  else {
    window.lastLogin = now;
  }
};

const trackEventInGa = (category, action, label, value, nonInteraction) => {
  'use strict';
  let ga_params;
  if (typeof(ga) !== 'undefined') {
    value = value || 1;
    ga_params = {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value
    };
    if (nonInteraction !== undefined) {
      ga_params.nonInteraction = nonInteraction;
    }
    ga('send', ga_params);
  }
};

export default { 'isLogged': isLogged, 'setLoggedTime': setLoggedTime, 'trackEventInGa': trackEventInGa };
