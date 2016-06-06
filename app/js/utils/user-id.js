let uuid = false;

if (window.localStorage) {
  uuid = window.localStorage.getItem('uuid');
  if (uuid === null) {
    uuid = Math.floor(Math.random() * 1000000000);
    window.localStorage.setItem('uuid', uuid);
  }
}

export default uuid;
