define('picture', ["jquery"], function($) {
    return {
        'loading' : false,
        'getItems' : function(callback, start, nb) {
            $.getJSON("/api/items?start=" + start + "&nb=" + nb, callback);
        }
    }
});