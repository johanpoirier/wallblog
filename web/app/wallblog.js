var Wallblog = Ember.Application.create();

//Wallblog.ApplicationAdapter = DS.FixtureAdapter.extend();

(function(Wallblog) {
    moment.lang("fr");

    Wallblog.ApplicationAdapter = DS.ActiveModelAdapter.extend({
        namespace: 'api',
        host: 'http://life.jops-dev.com'
    });

    Wallblog.ApplicationController = Ember.Controller.extend();

    Wallblog.ItemSerializer = DS.RESTSerializer.extend({
        normalizePayload: function(type, payload) {
            var response = {};
            response[type.typeKey] = payload;
            return response;
        }
    });

    Ember.Inflector.inflector.rules = {
        plurals:  [],
        singular: [],
        irregular: {},
        irregularInverse: {},
        uncountable: {}
    };
})(Wallblog);