var Wallblog = Ember.Application.create();

//Wallblog.ApplicationAdapter = DS.FixtureAdapter.extend();

(function(Wallblog) {

    moment.lang("fr");
    CLDR.defaultLocale = "fr";

    Wallblog.ApplicationAdapter = DS.ActiveModelAdapter.extend({
        host: 'http://wallblog.jops-dev.com',
        namespace: 'api/2'
    });

    Wallblog.ApplicationController = Ember.Controller.extend();

})(Wallblog);