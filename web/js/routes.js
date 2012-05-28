define("routes", ["jquery"], function($) {
    return {
        'routes' : new Array(),
        'handlers' : new Array(),
        
        'add' : function(path, handler) {
            this.routes.push("/" + path);
            this.handlers["/" + path] = handler;
        },
        
        'handle' : function(path) {
            // remove trailing query string part of the path
            path = path.split("?")[0];
            
            for(var i = 0; i<this.routes.length; i++){
                var registered_route = this.routes[i];
                
                var path_pattern = '^' + registered_route.replace(/:\w+\((.*)\)/g, '($1)').replace(/:\w+/g, '([\\w\-]+)') + '$';
                var path_regexp = new RegExp(path_pattern);
                var path_parts = path.match(path_regexp);

                // If path match
                if(path_parts) {
                    console.log("route ok : " + path);
                    this.handlers[path]();
                    return;
                }
            }
        }
    }
});