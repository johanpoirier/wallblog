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
    'jquery': 'vendor/jquery-2.1.4/index',
    'keymaster': 'vendor/keymaster/keymaster',
    'handlebars': 'vendor/handlebars/handlebars.amd',

    'underscore': 'libs/underscore',
    'underscore.string': 'libs/underscore.string',
    'backbone-orig': 'libs/backbone',
    'backbone': 'libs/resthub/backbone.ext',
    'localstorage': 'libs/localstorage',
    'text': 'libs/text',
    'i18n': 'libs/i18n',
    'pubsub': 'libs/resthub/pubsub',
    'backbone-validation-orig': 'libs/backbone-validation',
    'backbone-validation': 'libs/resthub/backbone-validation.ext',
    'resthub-handlebars': 'libs/resthub/handlebars-helpers',
    'backbone-queryparams': 'libs/backbone.queryparams',
    'backbone-paginator': 'libs/backbone.paginator',
    'async': 'libs/async',
    'hbs': 'libs/resthub/require-handlebars',
    'moment': 'libs/moment',
    'moment-fr': 'libs/moment-lang/fr',
    'resumable': 'libs/resumable',
    'templates': '../templates'
  }
});
