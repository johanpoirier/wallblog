define(['backbone', 'models/comment'], function(Backbone, Comment) {
    var CommentCollection = Backbone.Collection.extend({
        model: Comment,
        
        initialize: function(options) {
            this.url = "/api/item/" + options.item.get("id") + "/comments";
        }
    });
    return CommentCollection;
});