define(['underscore', 'backbone', 'views/column'],
    function(_, Backbone, ColumnView){
        var ColumnsView = Backbone.View.extend({     

            initialize: function() {
                // Add this context in order to allow automatic removal of the calback with dispose()
                _.bindAll(this, 'addOne', 'addAll', 'render');

                // Add this context in order to allow automatic removal of the calback with dispose()
                this.collection.on('add',     this.addOne, this);
                this.collection.on('reset',   this.addAll, this);
      
                if(this.collection.isEmpty()) {
                    this.collection.fetch();
                }
                else {
                    this.addAll();
                }
            },
    
            addOne: function(column) {
                new ColumnView({
                    root: $('#content'), 
                    model: column
                });
            },

            addAll: function() {
                this.collection.each(this.addOne);
            }
        });
        return ColumnsView;
    });