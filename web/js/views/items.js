define([
  'underscore', 'backbone', 'resthub-handlebars', 'collections/items', 'hbs!templates/items.html', 'views/item', 'i18n!nls/messages'],
  function(_, Backbone, Handlebars, ItemCollection, itemsTmpl, ItemView, messages){
  var ItemsView = Backbone.View.extend({

    // Delegated events for creating new items, and clearing completed ones.
    events: {
    },
    template: itemsTmpl,

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function(options) {
      // Add this context in order to allow automatic removal of the calback with dispose()
      _.bindAll(this, 'addOne', 'addAll', 'render');

      // Add this context in order to allow automatic removal of the calback with dispose()
      this.collection.on('add',     this.addOne, this);
      this.collection.on('reset',   this.addAll, this);
      this.collection.on('all',     this.refresh, this);
      
      this.render({messages: messages});

      this.collection.fetch();
    },
    
    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(item) {
      var itemView = new ItemView({root: $('.column'), model: item});
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
        this.collection.each(this.addOne);
    },
    
    refresh: function() {

    }
  });
  return ItemsView;
});
