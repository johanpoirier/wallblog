define(['backbone', 'underscore', 'hbs!templates/app.html', 'views/columns', 'collections/columns'],
    function(Backbone, _, appTmpl, ColumnsView, ColumnCollection){
        var AppView = Backbone.View.extend({
            template: appTmpl,
            strategy: 'replace',

            initialize: function() {
                _.bind(this.render, this);
                this.collection = new ColumnCollection();
                this.columnsView = new ColumnsView({collection: this.collection});
                this.render();
            },
            
            render: function() {
                AppView.__super__.render.apply(this, arguments);
                this.columnsView.render();
            }
        });
        return AppView;
    });