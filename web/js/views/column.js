define(['underscore', 'backbone', 'hbs!templates/column.html', 'views/items'],
function(_, Backbone, columnTmpl, ItemsView){
  var ColumnView = Backbone.View.extend({

    tagName:  "div",
    className: "column",
    template: columnTmpl,
    strategy: "append",

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function(options) {
      //_.bindAll(this, 'render', 'close', 'remove');
      // Add this context in order to allow automatic removal of the calback with dispose()
      this.model.on('change', this.refresh, this);
      this.model.on('destroy', this.remove, this);
      
      this.render();

      new ItemsView({collection: this.model.items, rootEl: this.el});
    },

    refresh: function() {
        this.render();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.clear();
    }
  });
  return ColumnView;
});
