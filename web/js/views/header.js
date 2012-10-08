define(['underscore',
        'backbone',
        'pubsub',
        'hbs!templates/header',
        'hbs!templates/header-zoom'],

function(_, Backbone, Pubsub, tmpl, tmplZoom) {

    var HeaderView = Backbone.View.extend({
        template: tmpl,
        className: "navbar navbar-fixed-top navbar-inverse",
        
        initialize: function() {
            Pubsub.on(App.Events.ITEMS_FETCHED, this.render, this);
            Pubsub.on(App.Events.ITEM_ZOOMED, this.renderZoom, this);
            this.render();
        },

        render: function(nbItems) {
            if(!nbItems) {
                nbItems = 0;
            }
            this.template = tmpl;
            HeaderView.__super__.render.apply(this, [{ nbItems: nbItems }]);
        },

        renderZoom: function(item) {
            this.template = tmplZoom;
            HeaderView.__super__.render.apply(this, [ item.toJSON() ]);
        }
    });
    return HeaderView;
});