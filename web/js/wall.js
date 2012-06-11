define("wall", ["jquery", "pictureSource", "tools", "storage", "zoom"], function($, pictureSource, tools, storage, zoom) {
    return {
        'header' : null,
        'template' : null,
        'nbItems' : 0,
        'columns' : null,
        'columnHeights' : null,
        
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
            tools.enableResizeLayout($.proxy(self.displayItems, this));

            // img full page functionnality
            zoom.init();
            
            // mousewheel detection
            require(["tmpl!/views/picture", "jquery.mousewheel"], function(picture) {
                var loadMore = function() {
                    if(!pictureSource.loadingComplete && (($(window).scrollTop() - ($(document).height() - $(window).height())) <= 0)) {
                        if(pictureSource.loading == false) {
                            pictureSource.loading = true;
                            pictureSource.getFullItems(function(items) {
                                if(items.length == 0) {
                                    pictureSource.loadingComplete = true;
                                    return;
                                }
       
                                // dispatch item to the shortest column
                                items = self.dispatchItems(items, true);
                                for(var i=0; i<items.length; i++) {
                                    $(picture(items[i])).appendTo($("div.column").eq(items[i]['column']));
                                }
                                
                                pictureSource.loading = false;
                            }, pictureSource.index, 3);
                            pictureSource.index += 3;
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
            
            // if not initialized
            if(!self.header && ! self.template) {
                self.init();
                return;
            }

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
                self.columns = new Array(new Array(), new Array());
                self.columnHeights = new Array(0, 0);
            }
            else {
                self.columns = new Array(new Array(), new Array(), new Array());
                self.columnHeights = new Array(0, 0, 0);
            }
            if((forceRefresh === true) || !localStorage) {
                pictureSource.getFullItems(function(items) {
                    // dispatching items to columns
                    self.dispatchItems(items, true);
                    pictureSource.index = 9;

                    // call to hbs template
                    $("#content").html(self.template({
                        "columns" : self.columns
                    }));
                }, 0, 9);
            }
            else {
                // dispatching items to columns
                var items = storage.getAll();
                items = tools.sort(items, "date");
                this.dispatchItems(items);

                // call to hbs template
                $("#content").html(self.template({
                    "columns" : self.columns
                }));

                // set scroll position
                $(document).scrollTop(tools.scrollPosition);
            }
        },
        
        'dispatchItems' : function(items, store) {
            for(i=0; i<items.length; i++) {
                if(store) {
                    storage.set(items[i]['id'], items[i]);
                }

                // format date to display
                items[i]['date'] = $.format.date(items[i]['date'], "dd MMM yyyy");
                
                // dispatch item to the shortest column
                var indexOfMinValue = tools.getIndexOfMinValue(this.columnHeights);
                items[i]['column'] = indexOfMinValue;
                this.columns[indexOfMinValue].push(items[i]);
                
                // add ratio to the column heights
                var ratio = parseInt(items[i]['height']) / parseInt(items[i]['width'])
                this.columnHeights[indexOfMinValue] += ratio;
            }
            return items;
        }
    }
});