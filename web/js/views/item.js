define(['jquery', 'underscore', 'backbone', 'resthub-handlebars', 'hbs!templates/item.html'],
function($, _, Backbone, Handlebars, itemTmpl){
  var ItemView = Backbone.View.extend({

    //... is a list tag.
    tagName:  'div',
    strategy: 'append',
    template: itemTmpl,

    // The DOM events specific to an item.
    events: {
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function(options) {
      _.bindAll(this, 'render', 'close', 'remove');
      // Add this context in order to allow automatic removal of the calback with dispose()
      this.model.on('change', this.refresh, this);
      this.model.on('destroy', this.remove, this);
      this.render(this.model.toJSON());
    },

    refresh: function() {
        this.render();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.clear();
    }
  });
  return ItemView;
});
