define(['underscore',
        'backbone',
        'pubsub',
        'tools',
        'models/user',
        'i18n!nls/labels',
        'hbs!templates/user-form'],
    
    function(_, Backbone, Pubsub, tools, User, labels, tmpl) {
        var UserFormView = Backbone.View.extend({     

            template: tmpl,
            root: "#modal",
            labels: labels,
            strategy: "append",
            tagName: "div",
            className: "modal",
            
            attributes: {
                id: "userFormModal",
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
                this.model = new User();
                this.render();
                this.$el.modal();
                this.$("#email").focus();
                this.$el.on("hidden", function() {
                    Backbone.history.navigate('/', false);
                });
            },
            
            submit: function() {
                this.model.save({
                    email: this.$("input[name='email']").val(),
                    password: this.$("input[name='password']").val()
                });
                
                this.$el.modal('hide');
            },
                       
            keyPressed: function(e) {
                if(e.keyCode === 13) {
                    this.submit();
                }
            }
        });
        return UserFormView;
    }
);