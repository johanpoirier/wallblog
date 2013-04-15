define(['underscore',
        'backbone',
        'pubsub',
        'keymaster',
        'i18n!nls/labels',
        'models/item',
        'views/comments',
        'views/comment-form',
        'hbs!templates/item-zoom'],
    
function(_,
         Backbone,
         Pubsub,
         key,
         labels,
         Item,
         CommentsView,
         CommentFormView,
         tmpl) {
             
    var ItemZoomView = Backbone.View.extend({
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
             
            if(this.model.get("file")) {
                this.render();
                this.fetchComments();
            }
            else {
                this.fetchItem(this.model.id);
            }
            
            key("esc", this.back);
            key("left", _.bind(function() {
                var prevId = this.model.get('prevId');
                if(prevId) {
                    this.fetchItem(parseInt(this.model.get('prevId')));
                    Backbone.history.navigate('/item/' + this.model.id, false);
                }
            }, this));
            key("right", _.bind(function() {
                var nextId = this.model.get('nextId');
                if(nextId) {
                    this.fetchItem(parseInt(this.model.get('nextId')));
                    Backbone.history.navigate('/item/' + this.model.id, false);
                }
            }, this));
        },

        fetchItem: function(id) {
            this.model = new Item({ "id": id });
            this.model.on("change", this.render, this);
            this.model.on("destroy", this.back, this);
            this.model.fetch();
        },
        
        render: function() {
            ItemZoomView.__super__.render.apply(this);
            if(this.availableWidth > this.minDesktopWidth) {
                var ratio = parseFloat(this.model.get("ratio"));
                this.$("img").width(Math.round(this.availableHeight * ratio));
                this.$("img").height(Math.round(this.$("img").width() / ratio));
                this.$(".commentBar").height(this.availableHeight);
            }
            new CommentFormView({ root: this.$(".commentForm"), item: this.model });
            this.fetchComments();
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
    return ItemZoomView;
});