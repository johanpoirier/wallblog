#!/usr/bin/env node
'use strict';

const fs = require('fs');
const config = require(__dirname + '/../config.json');

const publicConfigContent = [];
publicConfigContent.push('\'use strict\';');
publicConfigContent.push('const config = {};');
Object.keys(config.public).forEach(key => {
  publicConfigContent.push(`config['${key}'] = '${config.public[key]}';`);
});

publicConfigContent.push('export default config;');

fs.writeFile(__dirname + '/../app/js/config.js', publicConfigContent.join("\n"), function(err) {
  if(err) {
    return console.log(err);
  }
});
