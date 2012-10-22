define(['backbone', 'tools', 'views/comment'],

function(Backbone, tools, CommentView) {
    var CommentsView = Backbone.View.extend({

        initialize: function() {
            this.render();
            this.collection.on("add", this.renderComment, this);
        },

        render: function() {
            this.collection.each(this.renderComment, this);
                        // admin
            if(tools.isLogged()) {
                this.$("span.delete").show();
            }
        },
        
        renderComment: function(comment) {
            new CommentView({ model: comment, root: this.el });
        }
    });
    return CommentsView;
});