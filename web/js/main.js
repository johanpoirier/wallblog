// Set the require.js configuration for your application.
require.config({

    shim:{
        'underscore':{
            exports:'_'
        },
        'underscore.string':{
            deps:[
                'underscore'
            ],
            exports:'_s'
        },
        'handlebars':{
            exports:'Handlebars'
        },
        'backbone-orig':{
            deps:[
                'underscore',
                'underscore.string',
                'jquery'
            ],
            exports:'Backbone'
        }
    },

    // Libraries
    paths:{
        jquery:'libs/jquery',
        underscore:'libs/underscore',
        'underscore.string':'libs/underscore.string',
        'backbone-orig':'libs/backbone',
        'backbone':'resthub/backbone.ext',
        localstorage:'libs/localstorage',
        text:'libs/text',
        i18n:'libs/i18n',
        handlebars:'libs/Handlebars',
        'resthub-handlebars':'resthub/handlebars-helpers',
        hbs: 'resthub/handlebars-require',
        'jquery.mousewheel': 'libs/jquery.mousewheel',
        'jquery.dateFormat': 'libs/jquery.dateFormat',
        'jquery.filedrop': 'libs/jquery.filedrop'
    },
    
    locale: localStorage.getItem('locale') || 'fr-fr'
});

// Load our app module and pass it to our definition function
require(['backbone', 'router']
        , function(Backbone, AppRouter){
    window.app = new AppRouter();
    Backbone.history.start({pushState: true});
});