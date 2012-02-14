var loading = false;
var loadingComplete = false;
var page = 9;
var columns;

$(document).ready(function() {
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