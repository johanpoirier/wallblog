define("zoom", ["jquery", "Handlebars", "tools", "tmpl!../views/headbar-zoom", "jquery.dateFormat"], function($, hbs, tools, headbarZoom) {
    return {
        'init' : function() {
            // img full page functionnality
            require(["tmpl!/views/zoom", "tmpl!/views/comments", "tmpl!/views/comment"], function(zoomTmpl, commentsTmpl, commentTmpl) {
                hbs.registerHelper('formatDay', function(date) {
                    return $.format.date(date, "dd MMM yyyy");
                });
                hbs.registerHelper('formatDatetime', function(date) {
                    return $.format.date(date, "le dd/MM/yyyy à HH:mm");
                });
                
                $("img.wall").live("click", function() {
                    var img = $(this);
                    require(["storage"], function(storage) {
                        $(".loader").show();
                        
                        var zoomImage = function(data) {
                            // update uri
                            window.history.pushState(data, data['description'], "/item/" + data['id']);
                            tools.disableResizeLayout();

                            // display picture
                            data.currentDate = new Date();
                            tools.lockScroll();
                            $(".loader").hide();
                            $("#content").html(zoomTmpl(data));
                        
                            // display header bar
                            $(document).scrollTop(0);
                            $("header").html(headbarZoom(data));
            
                            // fix zoom top position
                            var zoomSection = $(".zoom");
                        
                            // adjust picture to availaible space
                            var pic = $("img", zoomSection);
                            availableWidth = $(window).width() - 20;
                            availableHeight = $(window).height() - 80;
                            ratio = pic.width() / pic.height();
                            if(pic.height() > availableHeight) {
                                pic.height(availableHeight);
                                newWidth = availableHeight * ratio;
                                if(newWidth > availableWidth) {
                                    pic.width(availableWidth);
                                    pic.height(availableWidth / ratio);
                                }
                            }
                            else if(pic.width() > availableWidth) {
                                pic.width(availableWidth);
                            }
            
                            // click on the pic to close the zoom
                            pic.click(function() {
                                window.history.back();
                            });
                            
                            // or press Esc
                            require(["shortcut"], function(shortcut) {
                                shortcut.remove("Esc");
                                shortcut.add("Esc", function() {
                                    window.history.back();
                                });
                            });

                            // load comments
                            var displayComments = function(data) {
                                $(commentsTmpl(data)).appendTo($("aside"));
                            };
                            $.get("/api/item/" + img.attr("id") + "/comments", displayComments);
                            
                            // set button handlers
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
                                            $(commentTmpl(data)).prependTo($("aside"));
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
                        }
                        
                        // check local storage before calling remote api
                        var item = storage.get(img.attr("id"));
                        if(item == null) {
                            $.get("/api/item/" + img.attr("id"), zoomImage);
                        }
                        else {
                            zoomImage(item);
                        }
                    });
                });
            });
        }
    }
});