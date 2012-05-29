define("like", ["jquery"], function($) {
    return {
        'init' : function() {
            var self = this;
            
            $("img.like").click(function() {
                $("img.like").hide();
                $("img.dontlike").show();
            });
            
            $("img.dontlike").click(function() {
                $("img.dontlike").hide();
                $("img.like").show();
            });
        }
    }
});