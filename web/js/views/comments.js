define(['backbone', 'views/comment'],

function(Backbone, CommentView) {
    var CommentsView = Backbone.View.extend({

        initialize: function() {
            this.render();
            this.collection.on("add", this.renderComment, this);
        },

        render: function() {
            this.collection.each(this.renderComment, this);
        },
        
        renderComment: function(comment) {
            new CommentView({ model: comment, root: this.el });
        }
    });
    return CommentsView;
});