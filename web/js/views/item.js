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

        context: {
            'apiKey': '8b6de376ff4a157964ca'
        },

        initialize: function(options) {
            this.model.set("quality", options.quality);
            if(this.model.get("type") === "video") {
                this.template = videoTmpl;
                this.context.width = this.root.width();
                this.context.height = Math.round(this.root.width() * this.model.get("reverseRatio"));
            }
        },

        render: function() {
            ItemView.__super__.render.apply(this, arguments);
        }
    });
    return ItemView;
});