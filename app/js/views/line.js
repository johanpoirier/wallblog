define([
    'backbone',
    'views/item',
    'views/video'],

  function (Backbone, ItemView, VideoView) {

    var LineView = Backbone.View.extend({

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
        if (this.currentRatio > 0.5) {
          this.height = this.baseHeight;
        } else {
          this.height = Math.floor((this.maxWidth / this.width) * this.baseHeight);
        }
        this.items.forEach(this.renderModel.bind(this));
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
          view = new VideoView({
            root: this.el,
            model: item
          });
        } else {
          view = new ItemView({
            'root': this.el,
            'model': item
          });
        }
        view.render();
      },

      isRendered: function () {
        return this.items.every(function (item) {
          return item.get('rendered');
        });
      }
    });

    return LineView;
  }
);
