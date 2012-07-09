define('admin', ["jquery", "tools", "jquery.filedrop"], function($, tools) {
    return {
        'loginTmpl' : null,
        
        'init' : function() {
            this.setupFiledrop();
        },

        'setupFiledrop' : function() {
            var dropbox = $(document);
            dropbox.filedrop({
                // The name of the $_FILES entry:
                paramname: 'pic',

                maxfiles: 1,
                maxfilesize: 30,
                url: '/api/item',

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
                        this.url = "/api/item?description=" + encodeURIComponent(desc);
                    }
                }
            });
        },
        
        'isAdmin' : function() {
            var lastLogin = tools.getFromSession("adminTimestamp");
            var now = new Date();
            return (lastLogin != null) && ((now.getTime() - lastLogin) < 600000);
        },
        
        'showLogin' : function() {
            var self = this;
            require(["shortcut", "tmpl!/views/login"], function(shortcut, loginTmpl) {
                if(!self.loginTmpl) {
                    self.loginTmpl = loginTmpl;
                }

                $("#content").append(self.loginTmpl());
                $("input[name='email']").focus();

                var submitButton = $("button.submit", $(".form.login"));
                submitButton.unbind("click");
                submitButton.click(function() {
                    $.ajax({
                        type: 'POST',
                        url: "/auth/login",
                        data: {
                            "email" : $("#email").val(), 
                            "password" : $("#password").val()
                        },
                        success: function() {
                            var now = new Date();
                            tools.setInSession("adminTimestamp", now.getTime());
                            self.hideLogin();
                            self.init();
                        },
                        error: function() {
                            alert("Email et/ou mot de passe incorrects.");
                        }
                    });
                });
                
                // click Cancel button to close dialog
                var cancelButton = $("button.cancel", $(".form.login"));
                cancelButton.unbind("click");
                cancelButton.click(function() {
                    self.hideLogin();
                });
                    
                // or press Esc
                require(["shortcut"], function(shortcut) {
                    shortcut.remove("Esc");
                    shortcut.add("Esc", function() {
                        self.hideLogin();
                    });
                });
            });
        },
        
        'hideLogin' : function() {
            $("button", $(".form.login")).unbind("click");
            $("#overlay").remove();
        }
    }
});