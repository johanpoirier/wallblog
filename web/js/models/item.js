define(['backbone', 'collections/comments'], function(Backbone, CommentCollection) {
    var ItemModel = Backbone.Model.extend({
        
        urlRoot: "/api/item",
        
        defaults: {
            type: "picture"
        },
        
        initialize: function() {
            this.comments = new CommentCollection({ item: this });
        },
        
        fetchComments: function() {
            this.comments.fetch();
        }
    });
    return ItemModel;
});