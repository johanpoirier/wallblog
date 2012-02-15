require(["jquery", "pictureSource", "tools", "shortcut", "jquery.dateFormat"],
    function($, pictureSource, tools, shortcut) {
        $(function() {
            tools.viewportWidth = window.innerWidth;

            // display header bar
            require(["tmpl!../views/headbar"], function(headbar) {
                $("header").html(headbar());
            });
            
            // load pics
            require(["tmpl!../views/wall"], function(wall) {
                // browser resizes -> update layout
                var resizeTimer;
                $(window).resize(function() {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(displayItems, 100);
                });
            
                var displayItems = function() {
                    // no redisplaying if the number of columns don't change
                    previousViewportWidth = tools.viewportWidth;
                    tools.viewportWidth = window.innerWidth;
                    if((previousViewportWidth != tools.viewportWidth)
                        && (((previousViewportWidth < 520) && (tools.viewportWidth < 520))
                            || ((previousViewportWidth >= 520) && (tools.viewportWidth >= 520)))) {
                        return;
                    }
                
                    // get items to display
                    pictureSource.getItems(function(items) {
                        // 2 or 3 columns ?
                        if(tools.viewportWidth < 520) {
                            columns = new Array(new Array(), new Array());
                        }
                        else {
                            columns = new Array(new Array(), new Array(), new Array());
                        }

                        // dispatching items to columns
                        columnIndex = 0;
                        for(i=0; i<items.length; i++) {
                            items[i]['date'] = $.format.date(items[i]['date'], "dd MMM yyyy");
                            columns[columnIndex].push(items[i]);
                            columnIndex++;
                            if (columnIndex == columns.length) {
                                columnIndex = 0;
                            }
                        }
                        pictureSource.index = 9;

                        // call to hbs template
                        $("#content").html(wall({
                            "columns" : columns
                        }));
                    }, 0, 9);
                };
                displayItems(); // first display
            });
            
            // img full page functionnality
            $("img.wall").live("click", function() {
                var pic = $(this);
                ratio = pic.width() / pic.height();

                $(".loader").show();
                $.get("/api/item/" + pic.attr("id"), function(data) {
                    //lockScroll();
                    $(".loader").hide();
            
                    // click on the pic to close the zoom
                    pic.click(function() {
                        zoomDiv.remove();
                    //unlockScroll();
                    });
                });
            });
            
            // mousewheel detection
            require(["tmpl!../views/picture", "jquery.mousewheel"], function(picture) {
                var loadMore = function() {
                    if(!pictureSource.loadingComplete && (($(window).scrollTop() - ($(document).height() - $(window).height())) <= 0)) {
                        if(pictureSource.loading == false) {
                            pictureSource.loading = true;
                            pictureSource.getItem(function(items) {
                                if(items.length == 0) {
                                    pictureSource.loadingComplete = true;
                                    return;
                                }
                                items[0]['date'] = $.format.date(items[0]['date'], "dd MMM yyyy");
                                $(picture(items[0])).appendTo(tools.getShorterColumn());
                                pictureSource.loading = false;
                            }, pictureSource.index++);
                        }
                    }
                };
                $(window).scroll(function() {
                    loadMore();
                });
                $(window).mousewheel(function() {
                    loadMore();
                });
                $(window).keydown(function(event) {
                    // arrow down
                    if (event.keyCode == '40') {
                        loadMore();
                    }
                });
            });
            
            // login key
            shortcut.add("Ctrl+Alt+L", function() {
                var email = prompt("Email ?");
                var password = "";
                if(email && (email.length > 0)) {
                    password = prompt("Password ?");
                    if(password && (password.length > 0)) {
                        $.ajax({
                            type: 'POST',
                            url: "/login",
                            data: {
                                "email" : email, 
                                "password" : password
                            },
                            success: function() {
                                alert("Login successful");
                            },
                            failure: function() {
                                alert("Login failed");
                            }
                        });
                    }
                }
            });
        });
    });