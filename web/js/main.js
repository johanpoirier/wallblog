require.config({
    paths: {
        "Handlebars": "lib/Handlebars",
        "tmpl": "lib/tmpl",
        "shortcut": "lib/shortcut",
        "jquery.mousewheel": "lib/jquery.mousewheel",
        "jquery.dateFormat": "lib/jquery.dateFormat",
        "jquery.filedrop": "lib/jquery.filedrop"
    }
});

require(["jquery", "routes", "tools", "wall"],
    function($, routes, tools, wall) {
        $(function() {
            // hashtag change event
            $(window).bind("popstate", function(event) {
                tools.viewportWidth = 0;
                tools.unlockScroll();
                wall.displayHeader();
                wall.displayItems(false);
                event.preventDefault();
            });
            
            // routes
            var path = window.location.pathname;
            if(path && (path === "/app.html")) {
                path = "/";
            }
            routes.add("item/:id", function() {
                console.log("item x");
                wall.init();
            });
            routes.add("", function() {
                // init wall
                wall.init();
            });
            routes.handle(path);
            
            // admin login
            var lastLogin = tools.get("adminTimestamp");
            var now = new Date();
            if((lastLogin != null) && ((now.getTime() - lastLogin) < 600000)) {
                require(["admin"], function(admin) {
                    admin.init();
                });
            }
            else {
                require(["shortcut"], function(shortcut) {
                    shortcut.add("Ctrl+Alt+L", function() {
                        var email = prompt("Email ?");
                        var password = "";
                        if(email && (email.length > 0)) {
                            password = prompt("Password ?");
                            if(password && (password.length > 0)) {
                                $.ajax({
                                    type: 'POST',
                                    url: "/auth/login",
                                    data: {
                                        "email" : email, 
                                        "password" : password
                                    },
                                    success: function() {
                                        require(["admin"], function(admin) {
                                            alert("Login successful");
                                            var now = new Date();
                                            tools.set("adminTimestamp", now.getTime());
                                            admin.init();
                                        });
                                    },
                                    failure: function() {
                                        alert("Login failed");
                                    }
                                });
                            }
                        }
                    });
                });
            }
        });
    }
    );