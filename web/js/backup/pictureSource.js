define('pictureSource', ["jquery"], function($) {
    return {
        'loading' : false,
        'loadingComplete' : false,
        'index' : 0,
        
        'getItems' : function(callback, start, nb) {
            $.getJSON("/api/items?start=" + start + "&nb=" + nb, callback);
        },
        
        'getFullItems' : function(callback, start, nb) {
            $.getJSON("/api/itemsfull?start=" + start + "&nb=" + nb, callback);
        },
        
        'getItem' : function(callback, index) {
            $.getJSON("/api/itemsfull?start=" + index + "&nb=1", callback);
        },
        
        'countItems' : function(callback) {
            $.getJSON("/api/items/count", callback);
        },
        
        'updateItem' : function(callback, item) {
            $.ajax({
                type: "PUT",
                url: "/api/item/" + item['id'],
                dataType: "json",
                data: '{ "id" : "' + item['id'] + '", "description" : "' + item['description'] + '"}',
                success: callback
            });
        }
    }
});