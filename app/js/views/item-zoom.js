define(['underscore',
    'backbone',
    'pubsub',
    'keymaster',
    'i18n!nls/labels',
    'models/item',
    'views/comments',
    'views/comment-form',
    'hbs!templates/item-zoom'],

  function (_,
            Backbone,
            Pubsub,
            key,
            labels,
            Item,
            CommentsView,
            CommentFormView,
            tmpl) {

    var ItemZoomView = Backbone.View.extend({
      template: tmpl,
      labels: labels,
      className: "zoom",
      strategy: "replace",

      minDesktopWidth: 700,

      context: {
        picture: true
      },

      events: {
        "click img": "back"
      },

      initialize: function (options) {
        this.availableHeight = options.availableHeight || 200;
        this.availableWidth = options.availableWidth || this.minDesktopWidth;

        if (this.model.get("file")) {
          this.render();
          this.fetchComments();
        }
        else {
          this.fetchItem(this.model.id);
        }

        // keyboard shortcuts
        key("esc", this.back);
        key("left", _.bind(function () {
          if (window.zoomCurrentIndex > 0) {
            var prevId = window.itemIds[--window.zoomCurrentIndex];
            this.fetchItem(parseInt(prevId));
            Backbone.history.navigate('/item/' + prevId, false);
          }
        }, this));
        key("right", _.bind(function () {
          if (window.zoomCurrentIndex < window.itemIds.length) {
            var nextId = window.itemIds[++window.zoomCurrentIndex];
            this.fetchItem(parseInt(nextId));
            Backbone.history.navigate('/item/' + nextId, false);
          }
        }, this));
      },

      fetchItem: function (id) {
        this.model = new Item({ "id": id });
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.back, this);
        this.model.fetch();
      },

      render: function () {
        this.context.picture = (this.model.get('type') === 'picture');
        if (this.context.picture) {
          $(window).resize(_.debounce(this.screenResize.bind(this), 200));

          var file = encodeURIComponent(decodeURIComponent(this.model.get('file'))), filenameInfo = file.split('.');
          this.model.set({
            'file': file,
            'extension': filenameInfo.pop(),
            'filename': filenameInfo.join('.')
          }, { silent: true });
        }

        if (this.model.get('type') === 'video') {
          var url = this.model.get('file');
          this.context.youtube = (url.match(/youtu/) !== null);
          this.context.vimeo = (url.match(/vimeo/) !== null);
          this.context.dailymotion = (url.match(/dailymotion/) !== null);
          this.context.videoId = url.split('/').pop();
        }

        ItemZoomView.__super__.render.apply(this);

        var localAvailableWidth = this.$el.find('.picture').outerWidth() * 0.99;

        var itemEl = this.$("img, iframe");
        var itemRatio = parseFloat(this.model.get("ratio"));
        var displayRatio = localAvailableWidth / this.availableHeight;

        // picture taller than display
        if (displayRatio > itemRatio) {
          itemEl.height(this.availableHeight);
          itemEl.width(Math.round(this.availableHeight * itemRatio));
        }
        // display taller than picture
        else {
          var newHeight = Math.round(localAvailableWidth / itemRatio);
          itemEl.width(localAvailableWidth);
          itemEl.height(newHeight);
          if (localAvailableWidth > this.minDesktopWidth) {
            itemEl.css("margin-top", Math.round((this.availableHeight - newHeight) / 2));
          }
        }

        if (localAvailableWidth > this.minDesktopWidth) {
          this.$(".comment-bar").height(this.availableHeight);
        }
        new CommentFormView({ el: this.$(".comment-form"), item: this.model });
        this.fetchComments();

        // focus on picture to listen on left & right keys
        this.$("img, iframe").focus();

        // find index in list of ids
        if (window.zoomCurrentIndex == 0) {
          for (var i = 0; i < window.itemIds.length; i++) {
            if (this.model.get("id") === window.itemIds[i]) {
              window.zoomCurrentIndex = i;
              break;
            }
          }
        }
      },

      fetchComments: function () {
        this.model.comments.comparator = function (comment) {
          return comment.get("id");
        };
        this.model.comments.on("reset", this.renderComments, this);
        this.model.comments.fetch();
        Pubsub.trigger(AppEvents.ITEM_ZOOMED, this.model);
      },

      renderComments: function () {
        new CommentsView({ collection: this.model.comments, el: this.$(".comments") });
      },

      back: function () {
        key.unbind("left");
        key.unbind("right");
        key.unbind("esc");
        Backbone.history.navigate("/", true);
      },

      screenResize: function () {
        var win = $(window);
        this.availableWidth = win.width();
        this.availableHeight = win.height() - 44;
        this.render();
      }
    });
    return ItemZoomView;
  });