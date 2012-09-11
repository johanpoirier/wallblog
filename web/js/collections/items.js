define(['underscore', 'backbone', 'models/item'], function(_, Backbone, Item) {
  var ItemCollection = Backbone.Collection.extend({
    model: Item
  });
  return ItemCollection;
});
