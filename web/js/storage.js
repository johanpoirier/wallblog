define('storage', ['jquery'], function($) {
    return {

        'set' : function(key, item) {
            var string_value = (typeof item === 'string') ? item : JSON.stringify(item);
            localStorage.setItem(key, string_value);
        },

        'get' : function(key) {
            var value = localStorage.getItem(key);
            if (typeof value === 'undefined' || value === null || value === '') {
                return null;
            }
            try {
                return $.parseJSON(value);
            } catch(e) {
                return null;
            }
        
        },

        'getItemAt' : function(id) {
            var key = localStorage.key(id);
            return this.get(key);
        },

        'getAll' : function() {
            var items = new Array();
            var nbItems = this.size();
            for(var i=0; i<nbItems; i++) {
                items.push(this.getItemAt(i));
            }
            return items;
        },

        'clear' : function() {
            localStorage.clear();
        },

        'remove' : function(key) {
            localStorage.removeItem(key);
        },
        
        'size' : function() {
            return localStorage.length;
        },
        
        'clear' : function() {
            localStorage.clear();
        }
    };
});