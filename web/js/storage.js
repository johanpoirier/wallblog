define('storage', ['jquery'], function($) {
    return {

        'set' : function(key, item) {
            var string_value = (typeof item == 'string') ? item : JSON.stringify(item);
            localStorage.setItem(key, string_value);
        },

        'get' : function(key) {
            var value = localStorage.getItem(key);
            if (typeof value == 'undefined' || value == null || value == '') {
                return null;
            }
            try {
                return $.parseJSON(value);
            } catch(e) {
                return null;
            }
        
        },
          
        'clear' : function() {
            localStorage.clear();
        },

        'remove' : function(key) {
            localStorage.removeItem(key);
        }
    };
});