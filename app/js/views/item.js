define(['jquery',
    'backbone',
    'i18n!nls/labels',
    'views/item-zoom',
    'hbs!templates/picture'],

  function ($, Backbone, labels, ItemZoomView, pictureTmpl) {

    var ItemView = Backbone.View.extend({

      template: pictureTmpl,
      labels: labels,
      className: 'item',
      strategy: 'append',
      tagName: 'article',

      events: {
        'click': 'zoom'
      },

      initialize: function () {
        var file = encodeURIComponent(this.model.get('file')), filenameInfo = file.split('.');
        this.model.set({
          'file': encodeURIComponent(file),
          'filename': filenameInfo.join('.'),
          'extension': filenameInfo.pop()
        }, { silent: true });
      },

      zoom: function () {
        window.currentScollPosition = $(window.document).scrollTop();
        Backbone.history.navigate('/item/' + this.model.get('id'), true);
        return false;
      }
    });
    return ItemView;
  });
