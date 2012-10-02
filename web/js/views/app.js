define(['backbone', 'hbs!templates/app.html', 'views/columns', 'collections/columns'],
    function(Backbone, appTmpl, ColumnsView, ColumnCollection){
        var AppView = Backbone.View.extend({
            template: appTmpl,
            strategy: 'replace',

            initialize: function() {
                if(!window.collection) {
                    window.collection = new ColumnCollection();
                }
                this.render();
                this.columnsView = new ColumnsView({collection: window.collection});
            }
        });
        return AppView;
    });