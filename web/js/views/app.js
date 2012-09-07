define(['jquery', 'underscore', 'backbone', 'resthub-handlebars', 'hbs!templates/app.html', 'i18n!nls/messages', 'views/items', 'collections/items'],
    function($, _, Backbone, Handlebars, appTmpl, messages, ItemsView, ItemCollection){
        var AppView = Backbone.View.extend({

            events: {
            },
            collection: new ItemCollection(),
            template: appTmpl,

            initialize: function() {
                this.render({messages: messages});
                new ItemsView({root: $('#content'), collection: this.collection});
            }
        });
        return AppView;
    });