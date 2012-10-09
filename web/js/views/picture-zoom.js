define(['backbone', 'pubsub', 'i18n!nls/labels', 'views/comments', 'hbs!templates/picture-zoom'],
function(Backbone, Pubsub, labels, CommentsView, tmpl) {
    var PictureZoomView = Backbone.View.extend({
        template: tmpl,
        labels: labels,
        className: "row-fluid",
        strategy: "replace",

        events: {
            "click img": "back"
        },

        initialize: function(options) {
            this.availableHeight = options.availableHeight || 200;
            this.model.on("change", this.render, this);
            this.model.on("change", this.fetchComments, this);
            this.model.fetch();
        },

        render: function() {
            PictureZoomView.__super__.render.apply(this);
            this.$(".commentBar").height(this.availableHeight);
        },

        fetchComments: function() {
            this.model.comments.on("reset", this.renderComments, this);
            this.model.comments.fetch();
            Pubsub.trigger(AppEvents.ITEM_ZOOMED, this.model);
        },

        renderComments: function() {
            new CommentsView({ collection: this.model.comments, el: this.$(".comments") });
        },

        back: function() {
            Backbone.history.navigate("/", true);
        }
    });
    return PictureZoomView;
});