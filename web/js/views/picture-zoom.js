define(['backbone', 'pubsub', 'hbs!templates/picture-zoom'], function(Backbone, Pubsub, tmpl) {
    var PictureZoomView = Backbone.View.extend({
        template: tmpl,
        className: "row-fluid",
        strategy: "replace",

        events: {
            "click img": "back"
        },

        initialize: function(options) {
            this.availableHeight = options.availableHeight || 200;
            this.model.on("change", this.render, this);
            this.model.on("change", this.sendEvent, this);
            this.model.fetch();
        },
                
        render: function() {
            PictureZoomView.__super__.render.apply(this);
            this.$(".comments").height(this.availableHeight);
        },

        sendEvent: function() {
            Pubsub.trigger(App.Events.ITEM_ZOOMED, this.model);
        },

        back: function() {
            Backbone.history.navigate("/", true);
        }
    });
    return PictureZoomView;
});