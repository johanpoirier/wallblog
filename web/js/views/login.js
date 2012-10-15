define(['underscore', 'backbone', 'tools', 'hbs!templates/login'],
    function(_, Backbone, tools, tmpl) {
        var LoginView = Backbone.View.extend({     

            template: tmpl,
            strategy: "append",
            tagName: "div",
            className: "modal",
            
            attributes: {
                id: "loginModal",
                tabindex: "-1",
                role: "dialog",
                "aria-labelledby": "myModalLabel",
                "aria-hidden": "true"
            },

            events: {
                "click .btn-primary": "submit",
                "keypress #password": "keyPressed"
            },

            initialize: function() {
                this.render();
                this.$el.modal();
                this.$("#email").focus();
                this.$el.on("hidden", function() {
                    Backbone.history.navigate('/', false);
                });
            },
            
            submit: function() {
                var email = this.$el.find("input[name='email']").val();
                var password = this.$el.find("input[name='password']").val();
                
                $.ajax({
                    type: 'POST',
                    url: "/auth/login",
                    data: {
                        "email" : email, 
                        "password" : password
                    },
                    success: _.bind(this.loginSuccess, this),
                    error: function() {
                        alert("Email et/ou mot de passe incorrects.");
                    }
                });
                this.$el.modal('hide');
            },
            
            loginSuccess: function(user) {
                Backbone.history.navigate('/', false);
                this.$el.modal('hide');
                tools.setLoggedTime();
                //App.user = user;
                //Pubsub.trigger(App.Events.USER_LOGGED_IN, user);
            },
            
            keyPressed: function(e) {
                if(e.keyCode === 13) {
                    this.submit();
                }
            }
        });
        return LoginView;
    }
);