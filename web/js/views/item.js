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

        initialize: function(options) {
            this.model.set("quality", options.quality);
            if(options.model.get("type") === "video") {
                this.template = videoTmpl;
            }
        },
        
        render: function() {
            ItemView.__super__.render.apply(this, arguments);
            if(this.model.get("type") === "video") {
                this.$el.attr("width", this.root.width());
            }
        }
    });
    return ItemView;
});