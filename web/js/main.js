var loading = false;
var loadingComplete = false;
var page = 9;
var columns;

$(document).ready(function() {
    // scroll auto loading
    $(window).mousewheel(function(event, delta) {
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
    columns = $("div.column");
    
    // img full page functionnality
    $("img.wall").live("click", function() {
        var pic = $(this);
        ratio = pic.width() / pic.height();

        $(".loader").show();
        $.get("/api/picture/" + pic.attr("id"), function(data) {
            lockScroll();
            $(".loader").hide();

            // load and display zoom pic + comments
            $(data).insertBefore($("article"));
            var zoomDiv = $("article.zoom");
            zoomDiv.css("top", window.scrollY);
            var pic = $("img", zoomDiv);
            availableWidth = $(window).width() - 345;
            availableHeight = $(window).height() - 60;
            ratio = pic.width() / pic.height();
            if(pic.height() > availableHeight) {
                pic.height(availableHeight);
                newWidth = availableHeight * ratio;
                if(newWidth > availableWidth) {
                    pic.width(availableWidth);
                }
            }
            else if(pic.width() > availableWidth) {
                pic.width(availableWidth);
            }
            
            // click on the pic to close the zoom
            pic.click(function() {
                zoomDiv.remove();
                unlockScroll();
            });
            
            $("header button").unbind("click");
            $("header button").click(function() {
                // show comment form
                var form = $("div.comment.form");
                form.show();
                resetFormComment(form);
                
                // virgin inputs
                var unVirgin = function(event) {
                    var element = $(event.currentTarget);
                    if(element.hasClass("virgin")) {
                        element.val("");
                        element.removeClass("virgin");
                    }
                };
                var author = $("input[name='author']", form);
                var text = $("textarea[name='text']", form);
                author.focus(unVirgin);
                text.focus(unVirgin);

                // add comment handler
                $("button.submit").unbind("click");
                $("button.submit").click(function() {
                    var id = $("input[name='id']").val();
                    if(!author.hasClass("virgin") && !text.hasClass("virgin")) {
                        var comment = {"idItem": id, "author": $("input[name='author']").val(), "text": $("textarea[name='text']").val(), "date": null};
                        $.post("/api/picture/" + id + "/comment", JSON.stringify(comment), function(data) {
                            $(data).insertAfter(form);
                            form.hide();
                        });
                    }
                });
                
                // cancel handler
                $("button.cancel").unbind("click");
                $("button.cancel").click(function() {
                    form.hide();
                });
            });
        });
    });
    
    // login key
    shortcut.add("Ctrl+Alt+L", function() {
        var email = prompt("Email ?");
        var password = "";
        if(email && (email.length > 0)) {
            password = prompt("Password ?");
            if(password && (password.length > 0)) {
                $.ajax({
                    type: 'POST',
                    url: "/login",
                    data: {"email" : email, "password" : password},
                    success: function() {
                        alert("Login successful");
                    },
                    failure: function() {
                        alert("Login failed");
                    }
                });
            }
        }
    });

    // upload functionnality
    var dropbox = $(document);
    dropbox.filedrop({
        // The name of the $_FILES entry:
        paramname: 'pic',
		
        maxfiles: 1,
        maxfilesize: 30,
        url: '/api/upload',
		
        uploadFinished: function() {
            location.reload();
        },
		
        error: function(err, file) {
            switch(err) {
                case 'BrowserNotSupported':
                    alert('Your browser does not support HTML5 file uploads!');
                    break;
                case 'TooManyFiles':
                    alert('Too many files! Only one allowed!');
                    break;
                case 'FileTooLarge':
                    alert(file.name + ' is too large! Please upload files up to 5mb.');
                    break;
                case 'UserNotLogged':
                    alert('You can\'t upload pictures if you\'re not logged.');
                    break;
                default:
                    break;
            }
        },
		
        // Called before each upload is started
        beforeEach: function(file) {
            if(!file.type.match(/^image\//)){
                alert('Only images are allowed!');
                return false;
            }
            var desc = prompt("Description de la photo ?");
            if(desc && desc.length > 0) {
                this.url = "/api/upload?description=" + desc;
            }
        }
    });
});

var resetFormComment = function(form) {
    var author = $("input[name='author']", form);
    author.addClass("virgin");
    author.val("votre nom ici ...");
    var text = $("textarea[name='text']", form);
    text.addClass("virgin");
    text.val("votre commentaire ici ...");
}

var loadMore = function() {
    if(!loading) {
        loading = true;
        $.getJSON("/api/more/" + ++page, function(newPics) {
            if(newPics.length == 0) {
                loadingComplete = true;
                console.log("loading complete");
                return;
            }

            for(var i=0; i<newPics.length; i++) {
                col = getShorterColumn();
                $("<div/>", {
                    "class": "item"
                }).appendTo(col);

                $("<img/>", {
                    "src": "pictures/" + newPics[i]['file'],
                    "class": "wall",
                    "id": newPics[i]['id']
                }).appendTo($("div.item:last", col));

                if(newPics[i]['date']) {
                    $("<h3/>").html($.format.date(newPics[i]['date'], "dd MMM yyyy")).appendTo($("div.item:last", col));
                }

                if(newPics[i]['description']) {
                    $("<h2/>").html(newPics[i]['description']).appendTo($("div.item:last", col));
                }
            }

            loading = false;
            console.log("loaded page " + page);
        });
    }
}

var getShorterColumn = function() {
    shorterColumnIndex = 0;
    minHeight = 999999;
    for(var i=0; i<columns.length; i++) {
        columnHeight = $("div.column").eq(i).height();
        if(columnHeight < minHeight) {
            shorterColumnIndex = i;
            minHeight = columnHeight;
        }
    }
    return columns[shorterColumnIndex];
}

var lockScroll = function() {
    // lock scroll position, but retain settings for later
    var scrollPosition = [
        self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
    ];
    var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
    html.data('scroll-position', scrollPosition);
    html.data('previous-overflow', html.css('overflow'));
    html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
}

var unlockScroll = function() {
    // un-lock scroll position
    var html = jQuery('html');
    var scrollPosition = html.data('scroll-position');
    html.css('overflow', html.data('previous-overflow'));
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
}