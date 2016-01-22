define([
    'backbone',
    'views/item',
    'views/video'],

  function (Backbone, ItemView, VideoView) {

    var LineView = Backbone.View.extend({

      defaultHeight: 270,

      initialize: function (options) {
        this.height = this.defaultHeight;
        this.width = 0;
        this.maxWidth = options.maxWidth;
        this.ratio = 1;
        this.items = [];
        this.rendered = false;
      },

      addItem: function (item) {
        var futureWidth = this.width + (this.height * item.get('ratio'));
        var futureRatio = this.computeRatio(futureWidth);
        if (futureRatio > this.ratio) {
          this.renderLine();
          return false;
        }

        this.ratio = futureRatio;
        this.width = futureWidth;
        this.items.push(item);

        return true;
      },

      computeRatio: function (width) {
        return Math.abs(width - this.maxWidth) / this.maxWidth;
      },

      renderLine: function () {
        this.rendered = true;
        if (this.ratio > 0.5) {
          this.height = this.defaultHeight;
        } else {
          this.height = Math.floor((this.maxWidth / this.width) * this.defaultHeight);
        }
        this.items.forEach(this.renderModel.bind(this));
        return this;
      },

      renderModel: function (item) {
        item.set({
          'width': Math.floor(this.height * item.get('ratio')),
          'height': this.height
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
        return this.rendered;
      }
    });

    return LineView;
  }
);
