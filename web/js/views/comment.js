define(['backbone', 'hbs!templates/comment'],

function(Backbone, tmpl) {
    var CommentView = Backbone.View.extend({
        template: tmpl,
        className: "span10 offset1 comment",
        strategy: "append",
        
        initialize: function() {
            this.render();
        }
    });
    return CommentView;
});