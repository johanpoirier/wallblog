define(['underscore', 'backbone', 'views/item'],
    function(_, Backbone, ItemView){
        var ItemsView = Backbone.View.extend({     

            initialize: function(options) {
                // Add this context in order to allow automatic removal of the calback with dispose()
                _.bindAll(this, 'addOne', 'render');
                
                this.rootEl = options.rootEl;

                // Add this context in order to allow automatic removal of the calback with dispose()
                this.collection.on('add',     this.addOne, this);
                this.collection.on('reset',   this.addAll, this);
	  
                this.collection.each(this.addOne, this);
            },
	
            addOne: function(item) {
                new ItemView({ root: this.rootEl, model: item });
            }
        });
        return ItemsView;
    });
