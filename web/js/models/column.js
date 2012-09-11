define(['underscore', 'backbone', 'collections/items'], function(_, Backbone, ItemCollection) {
  var ColumnModel = Backbone.Model.extend({

    // Wait for server feedback to perform deletion
    wait: true,
    items: new ItemCollection(),

    initialize: function() {
      
    },

    clear: function() {
      this.destroy();
    },
    
    add: function(item) {
      this.items.add(item);
    }

  });
  return ColumnModel;
});