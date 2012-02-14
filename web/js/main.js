require(["jquery", "pictureSource", "tools", "jquery.mousewheel"],
    function($, pictureSource, tools) {
        $(function() {
            tools.viewportWidth = window.innerWidth;

            // display header bar
            require(["tmpl!../views/headbar"], function(headbar) {
                $("header").html(headbar());
            });
            
            // browser resizes -> update layout
            var resizeTimer;
            $(window).resize(function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(displayItems, 100);
            });

            // load pics
            require(["tmpl!../views/wall"], function(wall) {
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
            require(["tmpl!../views/picture"], function(picture) {
                $(window).mousewheel(function(event, delta) {
                    if (delta < 0) {
                        if(!pictureSource.loadingComplete && (($(window).scrollTop() + $(window).height()) + 500) >= $(document).height()) {
                            if(pictureSource.loading == false) {
                                pictureSource.loading = true;
                                pictureSource.getItem(function(items) {
                                    if(items.length == 0) {
                                        pictureSource.loadingComplete = true;
                                        console.log("loading complete");
                                        return;
                                    }
                                    $(picture(items[0])).appendTo(tools.getShorterColumn());
                                    pictureSource.loading = false;
                                }, pictureSource.index++);
                            }
                        }
                    }
                });
            });
        });
    }
    );