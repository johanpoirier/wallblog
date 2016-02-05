function savePreference(key, value) {
  window.localStorage.setItem(key, value);
}

function getPreference(key) {
  return window.localStorage.getItem(key);
}

function removePreference(key) {
  return window.localStorage.removeItem(key);
}

var Settings = {
  saveDisplayMode: function (mode) {
    savePreference(Constants.DISPLAY_MODE_LABEL, mode);
  },

  getDisplayMode: function () {
    return getPreference(Constants.DISPLAY_MODE_LABEL) || Constants.DISPLAY_MODE_LINE;
  },

  saveFilter: function (filter) {
    savePreference(Constants.FILTER_LABEL, JSON.stringify(filter));
  },

  clearFilter: function () {
    removePreference(Constants.FILTER_LABEL);
  },

  getFilter: function () {
    return JSON.parse(getPreference(Constants.FILTER_LABEL)) || {};
  }
};

export default Settings;
