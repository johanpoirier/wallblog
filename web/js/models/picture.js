define(['backbone', 'collections/comments'], function(Backbone, CommentCollection) {
    var PictureModel = Backbone.Model.extend({
        
        urlRoot: "/api/item",
        
        initialize: function() {
            this.comments = new CommentCollection({ item: this });
        },
        
        fetchComments: function() {
            this.comments.fetch();
        }
    });
    return PictureModel;
});