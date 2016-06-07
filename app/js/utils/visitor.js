let uuid = false;
let likes = [];

function init() {
  if (window.localStorage) {
    let data = window.localStorage.getItem('visitor');
    if (data !== null) {
      data = JSON.parse(data);
      uuid = data['uuid'];
      likes = data['likes'];
    } else {
      uuid = Math.floor(100000000 * Math.random());
      save();
    }
  }
}

function save() {
  if (window.localStorage) {
    window.localStorage.setItem('visitor', JSON.stringify({
      'uuid': uuid,
      'likes': likes
    }));
  }
}

let visitor = {
  getUuid() {
   return uuid;
  },

  addLike(itemId) {
    likes.push(itemId);
    save();
  },

  doesLike(itemId) {
    return likes.indexOf(itemId) !== -1;
  }
};

init();

export default visitor;
