define(['underscore', 'backbone', 'models/item'], function(_, Backbone, Item){
	  
    var ItemCollection = Backbone.Collection.extend({
        // Reference to this collection's model.
        model: Item,

        url: 'api/item',

        parse:function (response) {
            var items = response.content;
            return items;
        }
  });
  return ItemCollection;
});
