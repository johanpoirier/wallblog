define(['underscore', 'backbone', 'hbs!templates/item.html', 'views/picture'],
    function(_, Backbone, itemTmpl, PictureView){
        var ItemView = Backbone.View.extend({

            tagName:  "div",
            className: "item",
            template: itemTmpl,
            strategy: "append",

            // The DOM events specific to an item.
            events: {
                'click img' : 'zoom'
            },

            initialize: function(options) {
                _.bindAll(this, 'render', 'zoom');
      
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
            },
    
            zoom: function() {
                new PictureView({
                    root: '#content', 
                    model: this.model
                });
                app.navigate("item/" + this.model.id);
            }
        });
        return ItemView;
    });
