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
        },
        
        'lockScroll' : function() {
            // lock scroll position, but retain settings for later
            var scrollPosition = [
            self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
            self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
            ];
            var html = $('html'); // it would make more sense to apply this to body, but IE7 won't have that
            html.data('scroll-position', scrollPosition);
            html.data('previous-overflow', html.css('overflow'));
            html.css('overflow', 'hidden');
            window.scrollTo(scrollPosition[0], scrollPosition[1]);
        },

        'unlockScroll' : function() {
            // un-lock scroll position
            var html = $('html');
            var scrollPosition = html.data('scroll-position');
            html.css('overflow', html.data('previous-overflow'));
            window.scrollTo(scrollPosition[0], scrollPosition[1]);
        },
        
        'resetFormComment' : function(form) {
            var author = $("input[name='author']", form);
            author.addClass("virgin");
            author.val("votre nom ici ...");
            var text = $("textarea[name='text']", form);
            text.addClass("virgin");
            text.val("votre commentaire ici ...");
        },
        
        'set' : function(key, value) {
            if(Modernizr.localstorage) {
                localStorage.setItem(key, value);
            }
        },
        
        'get' : function(key) {
            if(Modernizr.localstorage) {
                return localStorage.getItem(key);
            }
            return null;
        }
    }
});