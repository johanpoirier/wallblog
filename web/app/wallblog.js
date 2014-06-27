var Wallblog = Ember.Application.create();

//Wallblog.ApplicationAdapter = DS.FixtureAdapter.extend();

(function (Wallblog) {

    moment.lang("fr");
    CLDR.defaultLocale = "fr";

    Wallblog.ApplicationAdapter = DS.ActiveModelAdapter.extend({
        host: 'http://wallblog.jops-dev.com',
        namespace: 'api/2'
    });

    Wallblog.ApplicationController = Ember.Controller.extend({
        loginTimeoutHandler: null,
        sessionDuration: 1000 * 60 * 30, // session lasts 30 minutes

        isLogged: function() {
            return this.get('loginTimeoutHandler') !== null;
        }.property('loginTimeoutHandler'),

        login: function () {
            this.set('loginTimeoutHandler', setTimeout(_.bind(this.logout, this), this.get('sessionDuration')));
        },

        logout: function() {
            this.set('loginTimeoutHandler', null);
        }
    });

})(Wallblog);