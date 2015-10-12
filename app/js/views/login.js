define(['backbone',
    'views/modal',
    'pubsub',
    'tools',
    'i18n!nls/labels',
    'hbs!templates/login'],

  function (Backbone, ModalView, Pubsub, tools, labels, template) {
    var LoginView = ModalView.extend({

      root: 'body',
      labels: labels,
      strategy: 'append',
      template: template,

      attributes: {
        id: 'loginModal'
      },

      events: {
        'click #modalClose': 'close',
        'click #modalCancel': 'close',
        'click #modalSubmit': 'submit',
        'keypress #password': 'keyPressed'
      },

      initialize: function () {
        this.render();
        this.$el.css('opacity', '1');
        this.$el.find('#email').focus();
      },

      submit: function () {
        var email = this.$el.find("input[name='email']").val();
        var password = this.$el.find("input[name='password']").val();

        $.ajax({
          type: 'POST',
          url: '/auth/login',
          data: {
            'email': email,
            'password': password
          },
          success: this.loginSuccess.bind(this),
          error: function () {
            alert('Email et/ou mot de passe incorrects.');
          }
        });
        this.remove();
      },

      loginSuccess: function () {
        Backbone.history.navigate('/', false);
        this.remove();
        tools.setLoggedTime();
        Pubsub.trigger(AppEvents.USER_LOGGED_IN);
      },

      keyPressed: function (e) {
        if (e.keyCode === 13) {
          this.submit();
        }
      },

      close: function () {
        Backbone.history.navigate('/', false);
        this.remove();
      }
    });
    return LoginView;
  }
);
