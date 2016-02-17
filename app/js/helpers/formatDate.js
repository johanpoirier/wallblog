var moment = require('moment');
require("moment/locale/fr");
moment.locale('fr');

module.exports = function(date, outputPattern, inputPattern) {
  var defaultPattern = 'YYYY-MM-DD HH:mm:ss';
  var momentDate;

  if(date) {
    if((date instanceof Date) || (date instanceof Array)) {
      momentDate = moment(date);
    }
    else if(typeof(date) === 'string') {
      if(!inputPattern || (typeof(inputPattern) !== 'string')) {
        inputPattern = defaultPattern;
      }
      momentDate = moment(date, inputPattern);
    }
    else {
      return date;
    }
  }
  else {
    return "";
  }

  return momentDate.format(outputPattern ? outputPattern : defaultPattern);
}
