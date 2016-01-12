var webpack = require('webpack');

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
        test: /\.js$/,
        exclude: /vendor/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.hbs$/, loader: 'handlebars-loader?helperDirs[]=' + __dirname + '/app/js/helpers' },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  'plugins': [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ],
  'resolve': {
    'root': [
      __dirname + '/app/js',
    ],
    'modulesDirectories': ['app/js/vendor', 'node_modules'],
    'extensions': ['', '.js', '.hbs', '.json'],
    'alias': {
      'keymaster': 'vendor/keymaster/keymaster',
      'handlebars': 'vendor/handlebars/handlebars',
      'moment': 'vendor/moment/moment',
      'moment-fr': 'vendor/moment/locale/fr',
      'hammer': 'vendor/hammerjs/hammer',

      'localstorage': 'libs/localstorage',
      'text': 'libs/text',
      'pubsub': 'libs/pubsub',
      'async': 'libs/async',
      'resumable': 'libs/resumable',

      'templates': __dirname + '/app/templates'
    }
  }
};
