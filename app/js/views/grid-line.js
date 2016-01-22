define(['underscore',
    'backbone',
    'jquery',
    'pubsub',
    'tools',
    'views/line',
    'views/upload',
    'resthub-handlebars'],

  function (_, Backbone, $, Pubsub, tools, LineView, UploadView) {

    var GridLine = Backbone.View.extend({
      className: "grid line",
      strategy: "replace",
      tagName: "section",

      loading: false,
      loadingIncrement: 6,
      currentNbItems: 24,
      maxItemsToUpload: 12,

      currentLine: null,

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
        this.collection.on("add", this.addItemToLine, this);
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

        // first line
        this.$el.empty();
        this.newLine();

        // first time on the site ?
        if (this.collection.length === 0) {
          // Display one default image per column
          for (var i = 0; i < 18; i++) {
            this.collection.add({
              file: "empty.jpg",
              date: "2011-10-17 18:56:10",
              ratio: 1,
              reverseRatio: 1
            }, { silent: true });
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
        this.collection.each(this.addItemToLine, this);
        if ((this.filter && !this.currentLine.isRendered())) {
          this.currentLine.renderLine();
        }

        // set last scroll position
        if (window.currentScollPosition) {
          $(document).scrollTop(window.currentScollPosition);
        }
      },

      addItemToLine: function (item) {
        if (!this.currentLine.addItem(item)) {
          this.newLine().addItem(item);
        }
      },

      newLine: function () {
        var lineWidthMax = Math.floor(this.$el.innerWidth() * 0.98);
        this.currentLine = new LineView({
          'el': this.$el, 'maxWidth': lineWidthMax
        });
        return this.currentLine;
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
            success: function (items) {
              this.loading = false;
              this.currentNbItems = items.length;
            }.bind(this)
          });
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
          new UploadView({
            pictures: this.uploadPictures
          });
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
          }
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
    return GridLine;
  });
