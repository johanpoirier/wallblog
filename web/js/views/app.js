define(['backbone', 'underscore', 'hbs!templates/app.html', 'i18n!nls/messages', 'views/columns', 'collections/columns'],
    function(Backbone, _, appTmpl, messages, ColumnsView, ColumnCollection){
        var AppView = Backbone.View.extend({
            template: appTmpl,
            strategy: 'replace',

            collection: new ColumnCollection(),

            initialize: function() {
                //_.bindAll(this, 'refresh');
                this.columnsView = new ColumnsView({collection: this.collection});
                this.render({messages : messages});
                //this.on('all', this.refresh);
            },

            refresh: function() {
                this.columnsView.render();
            }
        });
        return AppView;
    });