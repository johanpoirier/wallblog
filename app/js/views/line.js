define([
    'backbone',
    'views/item',
    'views/video'],

  function (Backbone, ItemView, VideoView) {

    var LineView = Backbone.View.extend({

      defaultHeight: 320,

      initialize: function (options) {
        this.height = this.defaultHeight;
        this.items = [];
        this.ratio = 1;
        this.width = 0;
        this.maxWidth = options.maxWidth;
      },

      addItem: function (item) {
        this.items.push(item);
        this.width += this.height * item.get('ratio');
        this.ratio = Math.abs(this.width - this.maxWidth) / this.maxWidth;
      },

      getHeight: function () {
        return this.height;
      },

      getWidth: function () {
        return this.width;
      },

      getRatio: function () {
        return this.ratio;
      },

      renderLine: function () {
        this.height = Math.floor((this.maxWidth / this.width) * this.defaultHeight);
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
      }
    });

    return LineView;
  }
);
