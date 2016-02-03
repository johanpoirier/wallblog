import _ from 'underscore';
import Backbone from 'backbone';
import PubSub from 'pubsub';
import UploadVideoView from 'views/upload-video';
import FilterButtonView from 'views/filter-button';
import tools from 'tools';
import labels from 'nls/labels';
import template from 'templates/header';
import templateZoom from 'templates/header-zoom';
import templateEdit from 'templates/header-edit';

var HeaderView = Backbone.View.extend({

  className: 'headbar',

  events: {
    "click button#add-item": "upload",
    "dblclick .description": "editDescription",
    "keypress input[name='description']": "submitDescription",
    "blur input[name='description']": "escapeDescription",
    "click .delete": "deletePicture",
    'click #loginCancel': 'hideLogin',
    'click #loginSubmit': 'login',
    'click .menu': 'toggleMenu',
    'keypress #password': 'keyPressed',
    'click': 'hideFilter'
  },

  initialize: function (root) {
    Pubsub.on(AppEvents.ITEMS_ADDED, this.render, this);
    Pubsub.on(AppEvents.ITEM_ZOOMED, this.renderZoom, this);
    Pubsub.on(AppEvents.USER_LOGGED_IN, this.render, this);
    Pubsub.on(AppEvents.FILTER, this.saveFilter, this);
    Pubsub.on(AppEvents.CLEAR_FILTER, this.clearFilter, this);
    this.nbItems = 0;
    this.admin = false;
    this.root = root;
  },

  render: function (nbItems) {
    // retrieve total nb of items if we ask for refresh (-1)
    if (nbItems) {
      if (nbItems === -1) {
        this.requestNbItems();
      }
      else {
        this.nbItems = nbItems;
      }
    }

    this.$el.removeClass('zoom');

    // update browser title
    window.document.title = WallBlog.title;
    if (this.nbItems > 0) {
      window.document.title += " - " + this.nbItems + " photos";
    }

    // render header bar
    this.$el.html(template({ nbItems: this.nbItems, title: WallBlog.title, labels: labels }));
    this.root.html(this.el);
    this.delegateEvents(this.events);

    // Filter button
    this.filterButton = new FilterButtonView({ el: this.$(".filter"), filter: this.filter });
  },

  requestNbItems: function () {
    $.get("api/items/count", _.bind(this.render, this));
  },

  renderZoom: function (item) {
    // update browser title
    if (item.get("description")) {
      window.document.title = item.get("description") + ", " + WallBlog.title;
    }

    this.hideLogin();
    this.$el.addClass('zoom');

    // render with description in header bar
    this.item = item;
    this.$el.html(templateZoom({ "item": item.toJSON(), "admin": tools.isLogged(), labels: labels }));
    this.root.html(this.el);
    this.delegateEvents(this.events);
  },

  renderEdit: function () {
    this.$el.html(templateEdit({ "item": item.toJSON(), "admin": tools.isLogged(), labels: labels }));
    this.root.html(this.el);
    this.delegateEvents(this.events);
    this.$("input").focus();
  },

  upload: function () {
    if (!tools.isLogged()) {
      this.showLogin();
    }
    else {
      var videoUploadView = new UploadVideoView();
      $('body').append(videoUploadView.el);
    }
  },

  toggleMenu: function () {
    PubSub.trigger(AppEvents.MENU_TOGGLE);
  },

  showLogin: function () {
    this.$el.addClass('login');
    this.$el.find("input[type='email']").focus();
    Backbone.history.navigate('/login', false);
  },

  hideLogin: function (e) {
    if (e) {
      e.preventDefault();
      Backbone.history.navigate('/', false);
    }
    this.$el.removeClass('login');
  },

  keyPressed: function (e) {
    if (e.keyCode === 13) {
      this.login(e);
    }
  },

  login: function (e) {
    e.preventDefault();

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
        Backbone.history.navigate('/', false);
      }
    });
  },

  loginSuccess: function () {
    Backbone.history.navigate('/', false);
    this.hideLogin();
    tools.setLoggedTime();
    Pubsub.trigger(AppEvents.USER_LOGGED_IN);
  },

  editDescription: function () {
    if (tools.isLogged()) {
      this.renderEdit();
    }
  },

  submitDescription: function (e) {
    if (tools.isLogged()) {
      // Enter
      if (e.keyCode === 13) {
        this.item.set("description", this.$("input[name='description']").val());
        this.item.save();
        this.renderZoom(this.item);
      }
      // Escape
      else if (e.keyCode === 27) {
        this.escapeDescription();
      }
    }
  },

  escapeDescription: function () {
    // force header to be rendered in normal mode
    this.item.trigger("change");
  },

  deletePicture: function () {
    if (window.confirm(labels['confirmDeletePicture'])) {
      window.items.remove(this.item);
      this.item.destroy();
    }
  },

  saveFilter: function (monthId, year) {
    this.filter = {
      "year": year,
      "monthId": monthId
    };
  },

  clearFilter: function () {
    this.filter = null;
  },

  hideFilter: function (e) {
    if (e.target.classList.contains('side')) {
      this.filterButton.render(this.filter);
    }
  }
});

export default HeaderView;
