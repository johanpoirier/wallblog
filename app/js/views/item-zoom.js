import _ from 'underscore';
import Backbone from 'backbone';
import PubSub from 'utils/pubsub';
import tools from 'utils/tools';
import Events from 'utils/events';
import key from 'keymaster';
import Hammer from 'hammerjs';
import Item from 'models/item';
import CommentsView from 'views/comments';
import CommentFormView from 'views/comment-form';
import labels from 'nls/labels';
import template from 'templates/item-zoom';

export default Backbone.View.extend({

  labels: labels,
  className: "zoom",

  minDesktopWidth: 700,

  context: {
    picture: true
  },

  events: {
    'click img': 'back'
  },

  initialize: function (options) {
    this.availableHeight = options.availableHeight || 200;
    this.availableWidth = options.availableWidth || this.minDesktopWidth;
    this.root = options.root;

    this.itemIds = options.itemIds;
    this.zoomCurrentIndex = this.itemIds.indexOf(this.model.get('id'));

    if (this.model.get('file')) {
      this.render();
    }
    else {
      this.fetchItem(this.model.id);
    }

    // keyboard shortcuts
    key('esc', this.back);
    key('left', this.previousItem.bind(this));
    key('right', this.nextItem.bind(this));

    // gestures
    this.setupHammer(this.$el[0]);
  },

  setupHammer: function (element) {
    var hammertime = new Hammer(element);
    hammertime.get('swipe').set({ threshold: 10, velocity: 0.3, direction: Hammer.DIRECTION_HORIZONTAL });
    hammertime.on('swipeleft', this.nextItem.bind(this));
    hammertime.on('swiperight', this.previousItem.bind(this));

    return hammertime;
  },

  previousItem: function () {
    if (this.zoomCurrentIndex > 0) {
      var prevId = parseInt(this.itemIds[this.zoomCurrentIndex - 1], 10);
      if (!isNaN(prevId)) {
        this.zoomCurrentIndex -= 1;
        this.fetchItem(prevId);
        Backbone.history.navigate('/item/' + prevId, false);
        tools.trackEventInGa('Item', 'previous', '', prevId);
      }
    }
  },

  nextItem: function () {
    if (this.zoomCurrentIndex < this.itemIds.length) {
      var nextId = parseInt(this.itemIds[this.zoomCurrentIndex + 1], 10);
      if (!isNaN(nextId)) {
        this.zoomCurrentIndex += 1;
        this.fetchItem(nextId);
        Backbone.history.navigate('/item/' + nextId, false);
        tools.trackEventInGa('Item', 'next', '', nextId);
      }
    }
  },

  fetchItem: function (id) {
    this.model = new Item({ 'id': id });
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.back, this);
    this.model.fetch();
  },

  render: function () {
    PubSub.trigger(Events.ITEM_ZOOMED, this.model);
    this.context.picture = (this.model.get('type') === 'picture');
    if (this.context.picture) {
      $(window).on('resize', _.debounce(this.screenResize.bind(this), 100));

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

    this.context.model = this.model.toJSON();
    this.context.labels = labels;
    this.$el.html(template(this.context));
    this.root.html(this.el);

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
    if (this.zoomCurrentIndex == 0) {
      this.zoomCurrentIndex = this.itemIds.indexOf(this.model.get("id"));
    }
  },

  fetchComments: function () {
    this.model.comments.comparator = function (comment) {
      return comment.get("id");
    };
    this.model.comments.on("reset", this.renderComments, this);
    this.model.comments.fetch({ 'reset': true });
  },

  renderComments: function () {
    new CommentsView({ collection: this.model.comments, el: this.$(".comments") });
  },

  back: function () {
    Backbone.history.navigate('/', true);
  },

  screenResize: function () {
    var win = $(window);
    this.availableWidth = win.width();
    this.availableHeight = win.height() - 44;
    this.render();
    tools.trackEventInGa('Item', 'resize', `${this.availableWidth}x${this.availableHeight}`);
  },

  remove: function () {
    $(window).off('resize');

    key.unbind('left');
    key.unbind('right');
    key.unbind('esc');

    Backbone.View.prototype.remove.apply(this, arguments);
  }
});
