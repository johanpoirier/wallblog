define(['jquery',
        'backbone',
        'i18n!nls/labels',
        'views/picture-zoom',
        'hbs!templates/picture'],

function($, Backbone, labels, PictureZoomView, tmpl) {
    var PictureView = Backbone.View.extend({
        template: tmpl,
        labels: labels,
        className: "item",
        strategy: "append",

        events: {
            "click": "zoom"
        },
        
        zoom: function() {
            window.currentScollPosition = $(document).scrollTop();
            Backbone.history.navigate('/item/' + this.model.id, false);
            new PictureZoomView({ root: "#main", model: this.model, availableWidth: $(window).width(), availableHeight: $(window).height() - 50});
        }
    });
    return PictureView;
});