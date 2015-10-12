define(['backbone'], function(Backbone) {
    
    var CommentModel = Backbone.Model.extend({
        initialize: function() {
            this.urlRoot = "/api/item/" + this.get("idItem") + "/comments";
        }
    });
    return CommentModel;
});