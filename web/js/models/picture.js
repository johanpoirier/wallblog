define(['backbone'], function(Backbone) {
    var PictureModel = Backbone.Model.extend({
        
        urlRoot: "/api/item"

    });
    return PictureModel;
});