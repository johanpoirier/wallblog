import Backbone from 'backbone';
import ItemView from 'views/item';
import VideoView from 'views/video';
import PubSub from 'utils/pubsub';
import Events from 'utils/events';
import template from 'templates/line';

export default Backbone.View.extend({

  className: 'line',

  initialize: function (options) {
    this.baseHeight = options.baseHeight || 300;
    this.height = this.baseHeight;
    this.width = 0;
    this.maxWidth = options.maxWidth;
    this.lineNumber = options.lineNumber;
    this.currentRatio = 1;
    this.items = [];
    this.rendered = false;
  },

  addItem: function (item) {
    var futureWidth = this.width + parseFloat(item.get('ratio'));
    var futureRatio = this.computeRatio(futureWidth);
    if (futureRatio > this.currentRatio) {
      this.renderLine();
      return false;
    }

    this.currentRatio = futureRatio;
    this.width = futureWidth;
    this.items.push(item);

    return true;
  },

  computeRatio: function (width) {
    return Math.abs(width - this.maxWidth) / this.maxWidth;
  },

  renderLine: function () {
    this.rendered = true;
    if (this.currentRatio > 0.5) {
      this.height = this.baseHeight;
    } else {
      this.height = Math.floor((this.maxWidth / this.width) * this.baseHeight);
    }
    this.items.forEach(this.renderModel.bind(this));

    if (this.items.length > 0) {
      var firstItem = this.items[0];
      PubSub.trigger(Events.ADD_MARKER, {
        'date': firstItem.get('date'),
        'height': firstItem.get('height'),
        'line': this.lineNumber
      });
    }

    return this;
  },

  renderModel: function (item) {
    if (item.get('rendered')) {
      this.$('#' + item.get('id')).remove();
    }
    var itemWidth = Math.floor(this.height * item.get('ratio'));
    item.set({
      'width': itemWidth,
      'height': this.height,
      'srcWidth': Math.floor(100 * item.get('ratio') / this.maxWidth),
      'rendered': true
    }, { silent: true });

    var view;
    if (item.get('type') === 'video') {
      view = new VideoView({ model: item });
    } else {
      view = new ItemView({ 'model': item });
    }
    view.render();
    this.$el.append(view.el);
  },

  isRendered: function () {
    return this.items.every(function (item) {
      return item.get('rendered');
    });
  }
});
