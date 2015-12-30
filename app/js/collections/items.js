define(['backbone', 'es6!models/item'], function(Backbone, Item) {
    var ItemCollection = Backbone.Collection.extend({
        model: Item,
        url: 'api/item'
    });
    return ItemCollection;
});