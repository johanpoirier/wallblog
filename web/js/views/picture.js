define(['underscore', 'backbone', 'i18n!nls/labels', 'hbs!templates/picture'],

function(_, Backbone, labels, tmpl) {
    var PictureView = Backbone.View.extend({
        template: tmpl,
        labels: labels,
        className: "item",
        strategy: "append",

        events: {
            "click": "zoom"
        },
        
        zoom: function() {
            Backbone.history.navigate('/item/' + this.model.id, true);
        }/*,
 
        render: function() {
            PictureView.__super__.render.apply(this);
            this.$el.fadeIn();
        }*/
    });
    return PictureView;
});