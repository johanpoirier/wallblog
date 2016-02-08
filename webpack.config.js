var webpack = require('webpack');

var args = process.argv.filter(function(arg) { return arg.indexOf('--') === 0; }).reduce(function (prevArg, arg) {
  var keyValue = arg.substr(2).split('=');
  prevArg[keyValue[0]] = keyValue[1];
  return prevArg;
}, {});

module.exports = {
  'entry': 'main',
  'output': {
    'path': 'dist/js',
    'publicPath': './js/',
    'filename': 'wallblog' + (args['buildVersion'] || '') + '.js'
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
