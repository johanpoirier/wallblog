define("wall", ["jquery", "pictureSource", "tools", "storage", "zoom"], function($, pictureSource, tools, storage, zoom) {
    return {
        'header' : null,
        'template' : null,
        'nbItems' : 0,
        
        'init' : function() {
            var self = this;

            // first display
            storage.clear();
            require(["tmpl!/views/headbar"], function(headerTmpl) {
                pictureSource.countItems(function(total) {
                    self.header = headerTmpl;
                    self.nbItems = total;
                    self.displayHeader();
                });
            });
            require(["tmpl!/views/wall"], function(wallTmpl) {
                self.template = wallTmpl;
                self.displayItems(true);
            });
            
            // browser resizes -> update layout
            tools.enableResizeLayout(this.displayItems);

            // img full page functionnality
            zoom.init();
            
            // mousewheel detection
            require(["tmpl!/views/picture", "jquery.mousewheel"], function(picture) {
                var loadMore = function() {
                    if(!pictureSource.loadingComplete && (($(window).scrollTop() - ($(document).height() - $(window).height())) <= 0)) {
                        if(pictureSource.loading == false) {
                            pictureSource.loading = true;
                            pictureSource.getItem(function(items) {
                                if(items.length == 0) {
                                    pictureSource.loadingComplete = true;
                                    return;
                                }
                                
                                // store image
                                storage.set(items[0]['id'], items[0]);
       
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
                $(window).mousewheel(function(event, delta) {
                    if(delta < 0) {
                        loadMore();
                    }
                });
                $(window).keydown(function(event) {
                    // arrow down
                    if (event.keyCode == '40') {
                        loadMore();
                    }
                });
            });
        },

        'displayHeader' : function() {
            var self = this;
            $("header").attr("class", "");
            $("header").html(self.header({
                "nbItems" : self.nbItems
            }));
        },

        'displayItems' : function(forceRefresh) {
            var self = this;
            
            // no redisplaying if the number of columns don't change
            previousViewportWidth = tools.viewportWidth;
            tools.viewportWidth = window.innerWidth;
            if((previousViewportWidth === tools.viewportWidth)
                && (((previousViewportWidth < 520) && (tools.viewportWidth < 520))
                    || ((previousViewportWidth >= 520) && (tools.viewportWidth >= 520)))) {
                return;
            }

            // get items to display
            // 2 or 3 columns ?
            if(tools.viewportWidth < 520) {
                columns = new Array(new Array(), new Array());
            }
            else {
                columns = new Array(new Array(), new Array(), new Array());
            }
            if((forceRefresh === true) || !localStorage) {
                pictureSource.getFullItems(function(items) {
                    // dispatching items to columns
                    columnIndex = 0;
                    for(i=0; i<items.length; i++) {
                        // store image details
                        storage.set(items[i]['id'], items[i]);

                        // format date to display
                        items[i]['date'] = $.format.date(items[i]['date'], "dd MMM yyyy");
                        columns[columnIndex].push(items[i]);
                        columnIndex++;
                        if (columnIndex == columns.length) {
                            columnIndex = 0;
                        }
                    }
                    pictureSource.index = 9;

                    // call to hbs template
                    if(self.template) {
                        $("#content").html(self.template({
                            "columns" : columns
                        }));
                    }
                }, 0, 9);
            }
            else {
                // dispatching items to columns
                columnIndex = 0;
                var items = storage.getAll();
                items = tools.sort(items, "date");
                nbItems = items.length;
                for(i=0; i<nbItems; i++) {
                    items[i]['date'] = $.format.date(items[i]['date'], "dd MMM yyyy");
                    columns[columnIndex].push(items[i]);
                    columnIndex++;
                    if (columnIndex == columns.length) {
                        columnIndex = 0;
                    }
                }

                // call to hbs template
                $("#content").html(self.template({
                    "columns" : columns
                }));

                // set scroll position
                $(document).scrollTop(tools.scrollPosition);
            }
        }
    }
});