require(["jquery", "picture"],
    function($, picture, headbar) {
        $(function() {
            require(["tmpl!../views/headbar"], function(headbar) {
                $("header").html(headbar());
            });

            // load pics
            picture.getItems(function(items) {
                columns = new Array(new Array(), new Array(), new Array());
                columnIndex = 0;
                for(i=0; i<items.length; i++) {
                    columns[columnIndex].push(items[i]);
                    columnIndex++;
                    if (columnIndex == 3) {
                        columnIndex = 0;
                    }
                }
                require(["tmpl!../views/wall"], function(wall) {
                    $("#content").html(wall({
                        "columns" : columns
                    }));
                });
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
        });
    }
    );