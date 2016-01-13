import _ from 'underscore';
import Backbone from 'backbone';
import PubSub from 'pubsub';
import tools from 'tools';
import ItemView from 'views/item';
import VideoView from 'views/video';
import UploadView from 'views/upload';
import template from 'templates/grid';

var Grid = Backbone.View.extend({
  template: template,
  className: "grid",
  strategy: "replace",
  tagName: "section",

  loading: false,
  loadingIncrement: 6,
  currentNbItems: 15,
  maxItemsToUpload: 12,

  settings: {
    initNbColumns: 3,
    minColumnWidth: 160
  },

  events: {
    dragover: "handleDragOver",
    drop: "handleFileSelect"
  },

  initialize: function (options) {
    // listen to window resize event
    this.screenWidth = $(window).width();
    $(window).resize(_.bind(this.screenResize, this));

    // fetch items
    Pubsub.on(AppEvents.ITEMS_UPLOADED, this.fetchCurrent, this);
    this.collection.on("add", this.renderModel, this);
    this.collection.on("reset", this.render, this);
    this.collection.on("remove", this.render, this);
    if (this.collection.length === 0) {
      this.loading = true;
      this.fetchCurrent();
    }
    else {
      this.currentNbItems = this.collection.length;
      this.render();
    }

    // listen to filter
    if (options.filter) {
      this.filter = true;
      this.filterValue = options.filter.year + "-" + options.filter.month;
    }
    Pubsub.on(AppEvents.FILTER, this.filterItems, this);
    Pubsub.on(AppEvents.CLEAR_FILTER, this.clearFilter, this);
  },

  onDispose: function () {
    $(window).unbind("resize");
    $(window).unbind("scroll");
  },

  render: function () {
    this.loading = false;
    this.lastYOffset = window.pageYOffset;

    // compute number of columns
    this.nbColumns = this.settings.initNbColumns;
    while ((Math.round(this.screenWidth / this.nbColumns) < this.settings.minColumnWidth) && (this.nbColumns > 1)) {
      this.nbColumns--;
    }

    // save columns heights
    this.columnsSize = [];
    for (var i = 0; i < this.nbColumns; i++) {
      this.columnsSize[i] = {
        id: i + 1,
        value: 0
      };
    }

    // render of columns
    this.$el.html(template({ nbColumns: this.nbColumns }));

    // first time on the site ?
    if (this.collection.length === 0) {
      // Display one default image per column
      for (i = 0; i < this.nbColumns * 3; i++) {
        this.collection.add({
          file: "empty.jpg",
          date: "2011-10-17 18:56:10",
          ratio: 1,
          reverseRatio: 1
        }, {
          silent: true
        });
      }

      // Check if no user in db
      $.get("/api/users/count", function (nbUsers) {
        if (parseInt(nbUsers) === 0) {
          // Display new user form
          Backbone.history.navigate('/new-user', true);
        }
      });
    }

    // render of items
    this.collection.each(this.renderModel, this);

    // set last scroll position
    if (window.currentScollPosition) {
      $(document).scrollTop(window.currentScollPosition);
    }

    return this;
  },

  renderModel: function (model) {
    var shorterColumId = this.getShorterColumnId();
    var view;
    var root = this.$("#column" + shorterColumId);
    if (model.get('type') === 'video') {
      view = new VideoView({
        model: model
      });
    } else {
      view = new ItemView({
        'model': model
      });
    }
    this.columnsSize[shorterColumId - 1].value += parseFloat(model.get("reverseRatio"));

    root.append(view.render().el);
  },

  getShorterColumnId: function () {
    return _.reduceRight(this.columnsSize, function (a, b) {
      return (a.value < b.value) ? a : b;
    }).id;
  },

  screenResize: function () {
    var currentScreenWidth = $(window).width();
    var reRender = (this.screenWidth !== currentScreenWidth);
    this.screenWidth = currentScreenWidth;

    if (reRender) {
      this.render();
    }
  },

  loadMore: function () {
    if (!this.filter && !this.loading && ((window.pageYOffset - this.lastYOffset) > 0) && (($(window).scrollTop() - ($(document).height() - $(window).height())) <= 0)) {
      this.loading = true;
      this.collection.fetch({
        add: true,
        data: {
          start: this.currentNbItems,
          nb: this.loadingIncrement,
          comments: true
        },
        success: _.bind(function () {
          this.loading = false;
        }, this)
      });
      this.currentNbItems += this.loadingIncrement;
    }
    this.lastYOffset = window.pageYOffset;
  },

  handleFileSelect: function (e) {
    var evt = e.originalEvent;
    evt.stopPropagation();
    evt.preventDefault();

    if (tools.isLogged()) {
      if (window.FileReader) {
        var files = evt.dataTransfer.files;
        if (files.length <= this.maxItemsToUpload) {
          this.uploadPictures = [];
          this.uploadFiles(files, 0);
        }
        else {
          alert("Too many files! Only " + this.maxItemsToUpload + " allowed!");
        }
      }
      else {
        alert("Your browser does not support HTML5 file uploads!");
      }
    }
    else {
      alert("You must be logged in to upload pictures.");
      Backbone.history.navigate('/login', true);
    }
  },

  handleDragOver: function (e) {
    var evt = e.originalEvent;
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  uploadFiles: function (files, index) {
    if (index >= files.length) {
      var uploadView = new UploadView();
      uploadView.render(this.uploadPictures);
      $('body').append(uploadView.el);
      return;
    }

    var file = files[index];
    index += 1;

    if (!file.type.match("image.*")) {
      alert("Only images are allowed!");
      this.uploadFiles(files, index);
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      this.uploadPictures.push({
        data: e.target.result,
        filename: file.name,
        id: (this.uploadPictures.length + 1)
      });
      this.uploadFiles(files, index);
    }.bind(this);
    reader.readAsDataURL(file);
  },

  fetchCurrent: function () {
    this.filter = false;
    this.collection.fetch({
      data: {
        filter: this.filter ? this.filterValue : null,
        start: 0,
        nb: this.currentNbItems,
        comments: true
      },
      reset: true
    });
    Pubsub.trigger(AppEvents.ITEMS_ADDED, -1);
  },

  listenToScroll: function () {
    $(window).scroll(_.bind(this.loadMore, this));
  },

  filterItems: function (month, year) {
    this.filter = true;
    var filterValue = year;
    if (month) {
      filterValue += "-" + month;
    }
    this.collection.fetch({
      data: {
        filter: filterValue,
        comments: true
      }
    });
  },

  clearFilter: function () {
    this.filter = false;
    this.fetchCurrent();
  }
});

export default Grid;
