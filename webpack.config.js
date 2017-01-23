'use strict';

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./config.json');

module.exports = {
  'entry': 'main',
  'output': {
    'path': 'dist/js',
    'publicPath': './js/',
    'filename': 'wallblog.js'
  },
  module: {
    loaders: [
      {
        test: /sw\/.*\.js$/,
        loader: 'webpack-append',
        query: `const vapidPublicKey = '${config.vapidPublicKey}';`
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader?helperDirs[]=' + __dirname + '/app/js/helpers'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  'plugins': [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /(fr|en)/),
    new CopyWebpackPlugin([
      {
        from: 'app/js/sw/notifications.js',
        to: '../sw/notifications.js',
        transform: function(content) {
          let fileContent = content.toString();
          fileContent = fileContent.replace(/websiteUrlPlaceholder/, config.websiteUrl);
          fileContent = fileContent.replace(/notificationTitlePlaceholder/, config.notificationTitle);
          return fileContent;
        }
      }
    ])
  ],
  'resolve': {
    'root': [
      __dirname + '/app/js',
    ],
    'extensions': ['', '.js', '.hbs', '.json'],
    'alias': {
      'templates': __dirname + '/app/templates'
    }
  }
};
