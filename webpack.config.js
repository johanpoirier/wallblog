var webpack = require('webpack');

module.exports = {
  'entry': 'main',
  'devtool': '#@hidden-source-map',
  'output': {
    'path': 'dist/js',
    'publicPath': './js/',
    'filename': 'wallblog.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
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
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fr/)
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
