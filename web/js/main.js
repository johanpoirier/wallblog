require(["jquery", "picture", "tmpl!../views/headbar", "tmpl!../views/wall", "tmpl!../views/footer"],
    function($, picture, headbar, wall, footer) {
        $(function() {
            // load templates
            $("header").html(headbar());
            
            $("footer").html(footer());
            
            // load pics
            picture.getItems(function(items) { 
                $("#content").html(wall({ "items" : items }));
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