define(['backbone', 'es6!tools', 'views/comment'],

function(Backbone, tools, CommentView) {
    var CommentsView = Backbone.View.extend({

        initialize: function() {
            this.render();
            this.collection.on("add", this.renderComment, this);
        },

        render: function() {
            this.$el.html("");
            this.collection.each(this.renderComment, this);
        },
        
        renderComment: function(comment) {
            new CommentView({ model: comment, root: this.el, admin: tools.isLogged() });
        }
    });
    return CommentsView;
});