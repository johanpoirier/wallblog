define('tools', ["jquery", "i18n!nls/labels"], function($, i18n) {
    return {
        'viewportWidth' : 0,
        'scrollPosition' : 0,
        
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
        
        'getIndexOfMinValue' : function(myArray) {
            var indexOf = -1;
            var minValue = 99999999;
            for(var i=0; i<myArray.length; i++) {
                if(myArray[i] < minValue) {
                    minValue = myArray[i];
                    indexOf = i;
                }
            }
            return indexOf;
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
            if(scrollPosition && scrollPosition.length > 1) {
                window.scrollTo(scrollPosition[0], scrollPosition[1]);
            }
        },
        
        'resetFormComment' : function(form) {
            var author = $("input[name='author']", form);
            author.addClass("virgin");
            author.val(i18n.authorHint);
            var text = $("textarea[name='text']", form);
            text.addClass("virgin");
            text.val(i18n.commentHint);
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
        },
        
        'setInSession' : function(key, value) {
            if(Modernizr.localstorage) {
                sessionStorage.setItem(key, value);
            }
        },
        
        'getFromSession' : function(key) {
            if(Modernizr.localstorage) {
                return sessionStorage.getItem(key);
            }
            return null;
        },
        
        'sort' : function(items, criterion) {
            return items.sort(function(a, b) {
                if(!a[criterion]) {
                    if(!b[criterion]) {
                        return 0;
                    }
                    return 1;
                }
                else if(!b[criterion]) {
                    return -1;
                }
                return (a[criterion] < b[criterion]) ? 1 : -1;
            });
        },
        
        'enableResizeLayout' : function(handler) {
            this.disableResizeLayout();
            $(window).bind("resize", function() {
                handler();
            });
        },
        
        'disableResizeLayout' : function() {
             $(window).unbind("resize");
        }
    }
});