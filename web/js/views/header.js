define(['underscore',
        'jquery',
        'backbone',
        'pubsub',
        'i18n!nls/labels',
        'hbs!templates/header',
        'hbs!templates/header-zoom'],

function(_, $, Backbone, Pubsub, labels, tmpl, tmplZoom) {

    var HeaderView = Backbone.View.extend({
        template: tmpl,
        labels: labels,
        className: "navbar navbar-fixed-top navbar-inverse",
        
        initialize: function() {
            Pubsub.on(AppEvents.ITEMS_ADDED, this.render, this);
            Pubsub.on(AppEvents.ITEM_ZOOMED, this.renderZoom, this);
            this.nbItems = 0;
        },

        render: function(nbItems) {
            // retrieve total nb of items if we ask for refresh (-1)
            if(nbItems) {
                if(nbItems === -1) {
                    this.requestNbItems();
                }
                else {
                    this.nbItems = nbItems;
                }
            }
            this.template = tmpl;
            HeaderView.__super__.render.apply(this, [{ nbItems: this.nbItems }]);
        },
        
        requestNbItems: function() {
            $.get("api/items/count", _.bind(this.render, this));
        },

        renderZoom: function(item) {
            this.template = tmplZoom;
            HeaderView.__super__.render.apply(this, [ item.toJSON() ]);
        }
    });
    return HeaderView;
});