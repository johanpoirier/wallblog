define('tools', ["jquery"], function($) {
    return {
        'viewportWidth' : 0,
        
        'getShorterColumn' : function() {
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
    }
});