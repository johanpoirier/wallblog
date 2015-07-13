define(['jquery',
        'backbone',
        'i18n!nls/labels',
        'views/item-zoom',
        'hbs!templates/picture'],

function($, Backbone, labels, ItemZoomView, pictureTmpl) {
    
    var ItemView = Backbone.View.extend({
        
        template: pictureTmpl,
        labels: labels,
        className: "item",
        strategy: "append",

        initialize: function(options) {
            this.model.set("quality", options.quality);
        }
    });
    return ItemView;
});