const moment = require('moment');

let locale = navigator.language || navigator.userLanguage;
if (locale.toLowerCase() === 'en-us') {
  locale = 'en-gb';
} else if (locale.toLowerCase() === 'fr-fr') {
  locale = 'fr';
}
require(`moment/locale/${locale}`);

const lang = locale.split('-').shift().toLowerCase();
moment.locale(lang);

module.exports = function(date, outputPattern, inputPattern) {
  const defaultPattern = 'YYYY-MM-DD HH:mm:ss';
  let momentDate;

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
