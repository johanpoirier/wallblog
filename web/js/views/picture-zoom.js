define(['backbone', 'pubsub', 'i18n!nls/labels', 'views/comments', 'views/comment-form', 'hbs!templates/picture-zoom'],
function(Backbone, Pubsub, labels, CommentsView, CommentFormView, tmpl) {
    var PictureZoomView = Backbone.View.extend({
        template: tmpl,
        labels: labels,
        className: "row-fluid",
        strategy: "replace",

        minDesktopWidth: 620,

        events: {
            "click img": "back"
        },

        initialize: function(options) {
            this.availableHeight = options.availableHeight || 200;
            this.availableWidth = options.availableWidth || this.minDesktopWidth;
            this.model.on("change", this.render, this);
            this.model.on("change", this.fetchComments, this);
            this.model.fetch();
        },

        render: function() {
            PictureZoomView.__super__.render.apply(this);
            if(this.availableWidth > this.minDesktopWidth) {
                this.$(".commentBar").height(this.availableHeight);
            }
            new CommentFormView({ root: this.$(".commentForm"), item: this.model });
        },

        fetchComments: function() {
            this.model.comments.comparator = function(comment) {
                return comment.get("id");
            };
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