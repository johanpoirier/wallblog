Wallblog.LoginController = Ember.ObjectController.extend({

    needs: ['application'],

    email: "",
    password: "",

    actions: {
        login: function() {
            var email = this.get('email');
            var password = this.get('password');

            if (!Ember.isEmpty(email) && !Ember.isEmpty(password)) {
                $.post('http://wallblog.jops-dev.com/auth/login', {
                    email: email,
                    password: password
                }, _.bind(function() {
                    this.get("controllers.application").login();
                    return this.send('closeModal');
                }, this)).fail(function() {
                    alert(Ember.I18n.translations['loginFailed']);
                    return;
                });
            } else {
                console.warn("should display errors on login form");
            }
        },

        close: function() {
            return this.send('closeModal');
        }
    }
});