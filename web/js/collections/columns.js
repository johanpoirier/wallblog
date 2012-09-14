define(['backbone', 'models/column'], function(Backbone, Column){
	  
    var ColumnCollection = Backbone.Collection.extend({
        model: Column,
        url: 'api/item',
               
        parse: function(response) {
            var columns = new Array(new Column(), new Column(), new Column());
            var index = 0;
            for(i=0; i<response.length; i++) {
                columns[index++].add(response[i]);
                if(index > 2) {
                    index = 0;
                }
            }
            return columns;
        }
    });
    return ColumnCollection;
});