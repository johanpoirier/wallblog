require.config({
    paths: {
        "Handlebars": "lib/Handlebars",
        "tmpl": "lib/tmpl",
        "shortcut": "lib/shortcut",
        "jquery.mousewheel": "lib/jquery.mousewheel",
        "jquery.dateFormat": "lib/jquery.dateFormat",
        "jquery.filedrop": "lib/jquery.filedrop",
    }
});

require(["jquery", "routes", "tools", "wall", "zoom"],
    function($, routes, tools, wall, zoom) {
        $(function() {
            // routes
            var path = window.location.pathname;
            if(path && (path === "/app.html")) {
                path = "/";
            }
            
            // single item view
            routes.add("item/:id", function(id) {
                console.log("item " + id);
                zoom.init(id);
            });
            
            // wall view
            routes.add("", function() {
                // hashtag change event
                $(window).bind("popstate", function(event) {
                    tools.viewportWidth = 0;
                    tools.unlockScroll();
                    wall.displayHeader();
                    wall.displayItems(false);
                    event.preventDefault();
                });
                
                wall.init();
            });
            routes.handle(path);
            
            // admin login
            var lastLogin = tools.getFromSession("adminTimestamp");
            var now = new Date();
            if((lastLogin != null) && ((now.getTime() - lastLogin) < 600000)) {
                require(["admin"], function(admin) {
                    admin.init();
                });
            }
            else {
                require(["shortcut"], function(shortcut) {
                    shortcut.add("Ctrl+Alt+L", function() {
                        require(["admin"], function(admin) {
                            admin.showLogin(); 
                        });
                    });
                });
            }
        });
    }
    );