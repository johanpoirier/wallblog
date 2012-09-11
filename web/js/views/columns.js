define([
  'underscore', 'backbone', 'resthub-handlebars', 'collections/columns', 'hbs!templates/columns.html', 'views/column', 'i18n!nls/messages'],
  function(_, Backbone, Handlebars, ColumnCollection, columnsTmpl, ColumnView, messages){
  var ColumnsView = Backbone.View.extend({     
    
    template: columnsTmpl,
    tagName: "div",
    className: "column",
    strategy: "append",

    // Delegated events for creating new items, and clearing completed ones.
    events: {
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function(options) {
      // Add this context in order to allow automatic removal of the calback with dispose()
      _.bindAll(this, 'addOne', 'addAll', 'render');

      // Add this context in order to allow automatic removal of the calback with dispose()
      this.collection.on('add',     this.addOne, this);
      this.collection.on('reset',   this.addAll, this);
      
      this.render({messages: messages});

      this.collection.fetch({error: function() { console.log(arguments); }});
    },
    
    addOne: function(column) {
      var columnView = new ColumnView({root: $('#content'), model: column});
    },

    addAll: function() {
        this.collection.each(this.addOne);
    },
    
    refresh: function() {

    }
  });
  return ColumnsView;
});
