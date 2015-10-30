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
        var filenameInfo = this.model.get('file').split('.');
        this.model.set('extension', filenameInfo.pop());
        this.model.set('filename', filenameInfo.join('.'));
      },

      zoom: function () {
        window.currentScollPosition = $(window.document).scrollTop();
        Backbone.history.navigate('/item/' + this.model.get('id'), true);
        return false;
      }
    });
    return ItemView;
  });
