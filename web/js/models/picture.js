define(['models/item'], function(Item) {
    var PictureModel = Item.extend({
        
        urlRoot: "/api/item"

    });
    return PictureModel;
});