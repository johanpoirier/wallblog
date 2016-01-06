var LAST_LOGIN_KEY = "lastLogin";

var isLogged = () => {
  let lastLogin = 0;
  if (window.sessionStorage) {
    lastLogin = window.sessionStorage.getItem(LAST_LOGIN_KEY);
  }
  else {
    lastLogin = window.lastLogin;
  }
  return (lastLogin != 0) && ((Date.now() - lastLogin) < 3600000);
};

var setLoggedTime = () => {
  let now = Date.now();
  if (window.sessionStorage) {
    window.sessionStorage.setItem(LAST_LOGIN_KEY, now.getTime());
  }
  else {
    window.lastLogin = now.getTime();
  }
};

export default { 'isLogged': isLogged, 'setLoggedTime': setLoggedTime };
