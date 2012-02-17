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
            require(["Handlebars", "tmpl!../views/zoom", "tmpl!../views/comment"], function(hbs, zoomTmpl, commentTmpl) {
                hbs.registerHelper('formatDay', function(date) {
                    return $.format.date(date, "dd MMM yyyy");
                });
                hbs.registerHelper('formatDatetime', function(date) {
                    return $.format.date(date, "le dd/MM/yyyy à HH:mm");
                });
                
                $("img.wall").live("click", function() {
                    $(".loader").show();
                    $.get("/api/item/" + $(this).attr("id"), function(data) {
                        data.currentDate = new Date();
                        tools.lockScroll();
                        $(".loader").hide();
                        $(zoomTmpl(data)).insertBefore($("#content"));
                        
                        var zoomSection = $("section.zoom");
                        zoomSection.css("top", window.scrollY);
                        
                        var pic = $("img", zoomSection);
                        availableWidth = $(window).width() - 345;
                        availableHeight = $(window).height() - 60;
                        ratio = pic.width() / pic.height();
                        if(pic.height() > availableHeight) {
                            pic.height(availableHeight);
                            newWidth = availableHeight * ratio;
                            if(newWidth > availableWidth) {
                                pic.width(availableWidth);
                            }
                        }
                        else if(pic.width() > availableWidth) {
                            pic.width(availableWidth);
                        }
            
                        // click on the pic to close the zoom
                        pic.click(function() {
                            zoomSection.remove();
                            tools.unlockScroll();
                        });
                        
                        $("header button").unbind("click");
                        $("header button").click(function() {
                            // show comment form
                            var form = $("div.comment.form");
                            form.show();
                            tools.resetFormComment(form);
                
                            // virgin inputs
                            var unVirgin = function(event) {
                                var element = $(event.currentTarget);
                                if(element.hasClass("virgin")) {
                                    element.val("");
                                    element.removeClass("virgin");
                                }
                            };
                            var author = $("input[name='author']", form);
                            var text = $("textarea[name='text']", form);
                            author.focus(unVirgin);
                            text.focus(unVirgin);

                            // add comment handler
                            $("button.submit").unbind("click");
                            $("button.submit").click(function() {
                                var id = $("input[name='id']").val();
                                if(!author.hasClass("virgin") && !text.hasClass("virgin")) {
                                    var comment = {
                                        "idItem": id, 
                                        "author": $("input[name='author']").val(), 
                                        "text": $("textarea[name='text']").val(), 
                                        "date": null
                                    };
                                    $.post("/api/item/" + id + "/comments", JSON.stringify(comment), function(data) {
                                        $(commentTmpl(data)).insertAfter(form);
                                        form.hide();
                                    });
                                }
                            });
                
                            // cancel handler
                            $("button.cancel").unbind("click");
                            $("button.cancel").click(function() {
                                form.hide();
                            });
                        });
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