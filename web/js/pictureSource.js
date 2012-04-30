define('pictureSource', ["jquery"], function($) {
    return {
        'loading' : false,
        'loadingComplete' : false,
        'index' : 0,
        
        'getItems' : function(callback, start, nb) {
            $.getJSON("/api/items?start=" + start + "&nb=" + nb, callback);
        },
        
        'getItem' : function(callback, index) {
            $.getJSON("/api/items?start=" + index + "&nb=1", callback);
        },
        
        'countItems' : function(callback) {
            $.getJSON("/api/items/count", callback);
        }
    }
});