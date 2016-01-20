define([
    'backbone',
    'views/item',
    'views/video'],

  function (Backbone, ItemView, VideoView) {

    var LineView = Backbone.View.extend({

      defaultHeight: 320,

      initialize: function () {
        this.height = this.defaultHeight;
        this.items = [];
        this.ratio = 1;
      },

      addItem: function (item) {
        this.items.push(item);
      },

      setRatio: function (ratio) {
        this.ratio = ratio > 1.2 ? 1 : ratio;
        this.height = Math.floor(this.ratio * this.defaultHeight);
      },

      renderLine: function () {
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
