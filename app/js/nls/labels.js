var defaultLang = 'en';
var lang = (navigator.language || navigator.userLanguage).split('-').shift().toLowerCase();

var labels;
try {
  labels = require(`nls/${lang}.json`);
} catch(e) {
  console.warn(`Lang '${lang}' is not supported by Wallblog.`);
  labels = require(`nls/${defaultLang}.json`);
}

export default labels;
