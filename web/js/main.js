require(["jquery", "pictureSource", "tmpl!../views/headbar", "tmpl!../views/wall", "jquery.mousewheel"],
    function($, pictureSource, headbar, wall) {
        $(function() {
            $("header").html(headbar());

            var getShorterColumn = function() {
                divColumns = $("div.column");
                shorterColumnIndex = 0;
                minHeight = 999999;
                for(var i=0; i<divColumns.length; i++) {
                    columnHeight = $("div.column").eq(i).height();
                    if(columnHeight < minHeight) {
                        shorterColumnIndex = i;
                        minHeight = columnHeight;
                    }
                }
                return divColumns[shorterColumnIndex];
            }

            // load pics
            pictureSource.getItems(function(items) {
                columns = new Array(new Array(), new Array(), new Array());
                columnIndex = 0;
                for(i=0; i<items.length; i++) {
                    columns[columnIndex].push(items[i]);
                    columnIndex++;
                    if (columnIndex == 3) {
                        columnIndex = 0;
                    }
                }
                pictureSource.index = 9;

                $("#content").html(wall({
                    "columns" : columns
                }));
            }, 0, 9);
            
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
                                pictureSource.getItems(function(items) {
                                    $(picture(items[0])).appendTo(getShorterColumn());
                                    pictureSource.loading = false;
                                }, pictureSource.index++, 1);
                            //console.log("loading more pics");
                            }
                        }
                    }
                });
            });
        });
    }
    );