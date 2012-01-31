require(["jquery", "picture", "tmpl!../views/headbar", "tmpl!../views/wall"],
    function($, picture, headbar, wall) {
        $(function() {
            // load templates
            $("header").html(headbar());
            
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
                $("#content").html(wall({ "columns" : columns }));
            }, 0, 9);
            
            // scroll auto loading
            /*$(window).mousewheel(function(event, delta) {
                if (delta < 0) {
                    if(!loadingComplete && (($(window).scrollTop() + $(window).height()) + 500) >= $(document).height()) {
                        if(loading == false) {
                            loadMore();
                            console.log("loading more pics");
                        }
                    }
                }
            });

            // load columns
            columns = $("div.column");*/
        });
    }
);