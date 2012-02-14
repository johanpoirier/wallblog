define('pictureSourceMock', ["jquery"], function($) {
    return {
        'loading' : false,
        'loadingComplete' : false,
        'index' : 0,
        
        'getItems' : function(callback, start, nb) {
            $.getJSON("/js/mock/items.json", callback);
        },
        
        'getItem' : function(callback, index) {
            $.getJSON("/js/mock/item.json", callback);
        }
    }
});