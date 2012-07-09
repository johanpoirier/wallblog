define("zoom", ["jquery", "Handlebars", "pictureSource", "like", "tools", "jquery.dateFormat"],
    function($, hbs, pictureSource, like, tools) {
        return {
            'zoomTmpl' : null,
            'headbarZoomTmpl' : null,
            'commentsTmpl' : null,
            'commentTmpl' : null,
            'labels' : null,

            'init' : function(id) {
                var self = this;

                // img full page functionnality
                require(["tmpl!/views/headbar-zoom", "tmpl!/views/zoom", "tmpl!/views/comments", "tmpl!/views/comment", "i18n!nls/labels"], function(headbarZoomTmpl, zoomTmpl, commentsTmpl, commentTmpl, labels) {
                    self.headbarZoomTmpl = headbarZoomTmpl;
                    self.commentTmpl = commentTmpl;
                    self.commentsTmpl = commentsTmpl;
                    self.zoomTmpl = zoomTmpl;
                    self.labels = labels;
                    hbs.registerHelper('formatDay', function(date) {
                        return $.format.date(date, "dd MMM yyyy");
                    });
                    hbs.registerHelper('formatDatetime', function(date) {
                        return $.format.date(date, "le dd/MM/yyyy à HH:mm");
                    });
                
                    $("img.wall").live("click", function() {
                        self.displayItem($(this).attr("id"));
                    });
            
                    // display if id
                    if(id) {
                        self.displayItem(id);
                    }
                });
            },
        
            'displayItem' : function(id) {
                var self = this;
            
                tools.scrollPosition = $(document).scrollTop();

                // chec local storage if items present
                require(["storage", "admin"], function(storage, admin) {
                    $(".loader").show();
                        
                    var zoomImage = function(data) {
                        // update uri
                        if(Modernizr.history) {
                            window.history.pushState(data, data['description'], "/item/" + data['id']);
                        }
                        tools.disableResizeLayout();
                        
                        data['i18n'] = self.labels;
                        
                        // display header bar
                        $(document).scrollTop(0);
                        $("header").html(self.headbarZoomTmpl(data));
                        $("header").addClass("zoom");
                    
                        // change picture description handler
                        var desc = $("span.description", "header.zoom");
                        var changeDescHandler = function() {
                            if(admin.isAdmin()) {
                                var newDesc = $("<input type='text' size='44' maxlength='60' value='" + $.trim(desc.html()) + "' />");
                                desc.empty();
                                desc.append(newDesc);
                                newDesc.focus();
                                newDesc.select();
                                desc.unbind("click");
                                newDesc.bind('keypress', function(e) {
                                    if ((e.keyCode || e.which) == 13) {
                                        data['description'] = newDesc.val();
                                        pictureSource.updateItem(function(item) {
                                            desc.html(newDesc.val());
                                            desc.click(changeDescHandler);
                                            storage.set(item['id'], item);
                                        }, data);
                                    }
                                });
                            }
                        };
                        desc.click(changeDescHandler);
    
                        // display picture
                        data.currentDate = new Date();
                        tools.lockScroll();
                        $(".loader").hide();
                        $("#content").html(self.zoomTmpl(data));
            
                        // fix zoom top position
                        var zoomSection = $("article.zoom");
                        
                        // adjust picture to availaible space
                        var pic = $("img", zoomSection);
                        availableWidth = $(window).width() - 20;
                        availableHeight = $(window).height() - 80;
                            
                        // small screen fix
                        if($(window).width() > 600) {
                            availableWidth -= 300;
                        }
                        else {
                            availableHeight += 80;
                        }

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
                        $("aside").height(availableHeight);
            
                        // click on the pic to close the zoom
                        pic.click(function() {
                            self.close();
                        });
                            
                        // or press Esc
                        require(["shortcut"], function(shortcut) {
                            shortcut.remove("Esc");
                            shortcut.add("Esc", function() {
                                self.close();
                            });
                        });

                        // load comments
                        var displayComments = function(data) {
                            if(data.length > 0) {
                                $(self.commentsTmpl(data)).appendTo($("aside"));
                            }
                            else {
                                self.showCommentForm();
                            }
                        };
                        $.get("/api/item/" + id + "/comments", displayComments);
                            
                        // set button handlers
                        $("header button").unbind("click");
                        $("header button").click(function() {
                            // show comment form
                            self.showCommentForm();
                        });
                    }
                        
                    // check local storage before calling remote api
                    var item = storage.get(id);
                    if(item == null) {
                        $.get("/api/item/" + id, zoomImage);
                    }
                    else {
                        zoomImage(item);
                    }
                });
            },
        
            'showCommentForm' : function() {
                var self = this;

                like.init();

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
                            $(self.commentTmpl(data)).insertAfter($("aside div.comment.form"));
                            form.hide();
                        });
                    }
                });

                // cancel handler
                $("button.cancel").unbind("click");
                $("button.cancel").click(function() {
                    form.hide();
                });
            },

            'close' : function() {
                if(Modernizr.history) {
                    window.history.back();
                }
                else {
                    // fallback for IE
                    window.location.href = "/";
                }
            }
        }
    });