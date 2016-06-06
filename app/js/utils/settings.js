import Constants from 'utils/constants';

function savePreference(key, value) {
  window.sessionStorage.setItem(key, value);
}

function getPreference(key) {
  return window.sessionStorage.getItem(key);
}

function removePreference(key) {
  return window.sessionStorage.removeItem(key);
}

var Settings = {
  saveDisplayMode: function (mode) {
    savePreference(Constants.DISPLAY_MODE_LABEL, mode);
  },

  getDisplayMode: function () {
    return getPreference(Constants.DISPLAY_MODE_LABEL) || Constants.DISPLAY_MODE_LINE;
  },

  saveFilter: function (filter) {
    let year = parseInt(filter.year, 10);
    if (!Number.isInteger(year)) {
      filter = {};
    } else {
      let monthId = parseInt(filter.monthId, 10);
      if (!Number.isInteger(monthId)) {
        filter.monthId = null;
        filter.month = null;
      }
    }

    savePreference(Constants.FILTER_LABEL, JSON.stringify(filter));
  },

  clearFilter: function () {
    removePreference(Constants.FILTER_LABEL);
  },

  getFilter: function () {
    return JSON.parse(getPreference(Constants.FILTER_LABEL)) || {};
  },

  isFilterActive: function () {
    return getPreference(Constants.FILTER_LABEL) !== null;
  }
};

export default Settings;
