// Set the require.js configuration for your application.
require.config({

  shim: {
    'underscore': {
      exports: '_'
    },
    'underscore.string': {
      deps: [
        'underscore'
      ]
    },
    'handlebars': {
      exports: 'Handlebars'
    },
    'backbone-orig': {
      deps: [
        'underscore',
        'underscore.string',
        'jquery'
      ],
      exports: 'Backbone'
    },
    'backbone-queryparams': {
      deps: [
        'backbone-orig',
        'underscore'
      ]
    },
    'backbone-paginator': {
      deps: [
        'backbone-orig',
        'underscore',
        'jquery'
      ],
      exports: 'Backbone.Paginator'
    },
    'dateFormat': {
      deps: [
        'jquery'
      ]
    },
    'moment-fr': {
      deps: [
        'moment'
      ]
    },
    'keymaster': {
      exports: 'key'
    },
    'resumable': {
      deps: [
        'jquery'
      ]
    }
  },

  // Libraries
  paths: {
    'es6': 'vendor/requirejs-babel/es6',
    'babel': 'vendor/requirejs-babel/babel-5.8.34.min',
    'jquery': 'vendor/jquery-2.1.4/index',
    'keymaster': 'vendor/keymaster/keymaster',
    'handlebars': 'vendor/handlebars/handlebars',
    'moment': 'vendor/moment/moment',
    'moment-fr': 'vendor/moment/locale/fr',
    'i18n': 'vendor/i18n/i18n',
    'hammer': 'vendor/hammerjs/hammer',

    'underscore': 'libs/underscore',
    'underscore.string': 'libs/underscore.string',
    'backbone-orig': 'libs/backbone',
    'backbone': 'libs/resthub/backbone.ext',
    'localstorage': 'libs/localstorage',
    'text': 'libs/text',
    'pubsub': 'libs/resthub/pubsub',
    'backbone-validation-orig': 'libs/backbone-validation',
    'backbone-validation': 'libs/resthub/backbone-validation.ext',
    'resthub-handlebars': 'libs/resthub/handlebars-helpers',
    'backbone-queryparams': 'libs/backbone.queryparams',
    'backbone-paginator': 'libs/backbone.paginator',
    'async': 'libs/async',
    'hbs': 'libs/resthub/require-handlebars',
    'resumable': 'libs/resumable',

    'templates': '../templates'
  }
});
