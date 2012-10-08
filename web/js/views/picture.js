define(['underscore', 'backbone', 'hbs!templates/picture'],

function(_, Backbone, tmpl) {
    var PictureView = Backbone.View.extend({
        template: tmpl,
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