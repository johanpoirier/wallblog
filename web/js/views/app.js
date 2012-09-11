define(['jquery', 'underscore', 'backbone', 'resthub-handlebars', 'hbs!templates/app.html', 'i18n!nls/messages', 'views/columns', 'collections/columns'],
    function($, _, Backbone, Handlebars, appTmpl, messages, ColumnsView, ColumnCollection){
        var AppView = Backbone.View.extend({
            template: appTmpl,
            strategy: 'prepend',

            collection: new ColumnCollection(),

            initialize: function() {
                this.render({messages: messages});
                new ColumnsView({root: $('#content'), collection: this.collection});
            }
        });
        return AppView;
    });