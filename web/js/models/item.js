define(['underscore', 'backbone'], function(_, Backbone) {
  var ItemModel = Backbone.Model.extend({

    // Default attributes for the todo.
    defaults: {
      description: 'no description',
      file: 'http://omerveilles.com/images/question-mark.gif'
    },

    // Wait for server feedback to perform deletion
    wait: true,

    // Ensure that each todo created has `content`.
    initialize: function() {
      if (!this.get('description')) {
        this.set({'description': this.defaults.description});
      }
    },

    // Remove this Todo from *localStorage*.
    clear: function() {
      this.destroy();
    }

  });
  return ItemModel;
});