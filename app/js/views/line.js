import Backbone from 'backbone';
import ItemView from 'views/item';
import VideoView from 'views/video';

export default Backbone.View.extend({

  initialize: function (options) {
    this.baseHeight = options.baseHeight || 300;
    this.height = this.baseHeight;
    this.width = 0;
    this.maxWidth = options.maxWidth;
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
    return this;
  },

  renderModel: function (item) {
    var itemWidth = Math.floor(this.height * item.get('ratio'));
    item.set({
      'width': itemWidth,
      'height': this.height,
      'srcWidth': Math.floor(100 * item.get('ratio') / this.maxWidth)
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
    return this.rendered;
  }
});
