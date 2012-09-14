define(['jquery', 'underscore', 'backbone', 'hbs!templates/picture.html'],
function($, _, Backbone, pictureTmpl){
  var PictureView = Backbone.View.extend({

    tagName:  "div",
    className: "zoom",
    template: pictureTmpl,

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function(options) {
      _.bindAll(this, 'render');
      
      // Add this context in order to allow automatic removal of the calback with dispose()
      this.model.on('change', this.refresh, this);
      this.model.on('destroy', this.remove, this);
      this.render(this.model.toJSON());
    },

    refresh: function() {
        this.render();
    }
  });
  return PictureView;
});
