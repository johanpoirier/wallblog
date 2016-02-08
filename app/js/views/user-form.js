import _ from 'underscore';
import Backbone from 'backbone';
import PubSub from 'utils/pubsub';
import tools from 'utils/tools';
import User from 'models/user';
import labels from 'nls/labels';
import template from 'templates/user-form';

var UserFormView = Backbone.View.extend({

  template: template,
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
    "keypress #password": "keyPressed",
    "click input": "resetErrors"
  },

  initialize: function () {
    this.model = new User();
    this.render();
    this.$el.modal();
    this.$("#email").focus();
    this.$el.on("hidden", function () {
      Backbone.history.navigate('/', false);
    });
  },

  submit: function () {
    this.resetErrors();

    var email = this.$("input[name='email']").val();
    var password = this.$("input[name='password']").val();
    var passwordCheck = this.$("input[name='repeatPassword']").val();

    var error = false;

    if ((email === "") || !this.validateEmail(email)) {
      this.$("#groupEmail").addClass("error");
      this.$("#groupEmail .help-inline").show();
      error = true;
    }

    if ((password === "") || (password !== passwordCheck)) {
      this.$("#groupRepeatPassword").addClass("error");
      this.$("#groupRepeatPassword .help-inline").show();
      error = true;
    }

    if (error) {
      return;
    }

    this.model.save({
        email: email,
        password: password
      },
      {
        success: _.bind(function () {
          this.$el.modal('hide');

          // Display login form
          Backbone.history.navigate('/login', true);
        }, this),
        error: function () {
          alert("Sorry, a problem occured during the creation of your account.");
        }
      });
  },

  resetErrors: function () {
    this.$(".error").removeClass("error");
    this.$(".help-inline").hide();
  },

  keyPressed: function (e) {
    if (e.keyCode === 13) {
      this.submit();
    }
  },

  validateEmail: function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
});

export default UserFormView;
