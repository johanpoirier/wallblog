define(['backbone', 'hbs!templates/app.html', 'i18n!nls/messages', 'views/columns', 'collections/columns'],
    function(Backbone, appTmpl, messages, ColumnsView, ColumnCollection){
        var AppView = Backbone.View.extend({
            template: appTmpl,
            strategy: 'prepend',

            collection: new ColumnCollection(),

            initialize: function() {
                this.render({messages: messages});
                new ColumnsView({collection: this.collection});
            }
        });
        return AppView;
    });