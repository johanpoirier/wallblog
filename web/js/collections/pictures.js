define(['backbone', 'models/picture'], function(Backbone, Picture) {
    var PictureCollection = Backbone.Collection.extend({
        model: Picture,
        url: 'api/item'
    });
    return PictureCollection;
});