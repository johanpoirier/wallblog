define(['backbone', 'collections/items'], function(Backbone, ItemCollection) {
    var ColumnModel = Backbone.Model.extend({

        initialize: function(options) {
            // Add this context in order to allow automatic removal of the calback with dispose()
            _.bindAll(this, 'add', 'clear');
            this.items = new ItemCollection();
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