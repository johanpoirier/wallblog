import Constants from 'utils/constants';

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
    let year = parseInt(filter.year, 10);
    if (!Number.isInteger(year)) {
      year = null;
    }

    let monthId = parseInt(filter.monthId, 10);
    let month = null;
    if (!Number.isInteger(monthId)) {
      monthId = null;
      month = null;
    }

    savePreference(Constants.FILTER_LABEL, JSON.stringify({
      'year': year,
      'month': month,
      'monthId': monthId
    }));
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
