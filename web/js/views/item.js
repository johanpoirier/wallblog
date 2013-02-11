define(['jquery',
        'backbone',
        'i18n!nls/labels',
        'views/item-zoom',
        'hbs!templates/picture',
        'hbs!templates/video'],

function($, Backbone, labels, ItemZoomView, pictureTmpl, videoTmpl) {
    
    var ItemView = Backbone.View.extend({
        
        template: pictureTmpl,
        labels: labels,
        className: "item",
        strategy: "append",

        events: {
            "click": "zoom"
        },
        
        initialize: function(options) {
            if(options.model.get("type") === "video") {
                this.template = videoTmpl;
            }
        },
        
        render: function() {
            ItemView.__super__.render.apply(this, arguments);
            if(this.model.get("type") === "video") {
                this.$el.attr("width", this.root.width());
            }
        },

        zoom: function() {
            if(this.model.get("type") === "picture") {
                window.currentScollPosition = $(document).scrollTop();
                Backbone.history.navigate('/item/' + this.model.id, false);
                new ItemZoomView({ root: "#main", model: this.model, availableWidth: $(window).width(), availableHeight: $(window).height() - 50});
            }
        }
    });
    return ItemView;
});