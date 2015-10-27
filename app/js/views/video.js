define(['jquery',
    'views/item',
    'i18n!nls/labels',
    'hbs!templates/video'],

  function ($, Item, labels, videoTmpl) {

    var VideoView = Item.extend({

      template: videoTmpl,
      labels: labels,
      className: "item",
      strategy: "append",

      events: {
        'click .click-overlay': 'zoom'
      },

      initialize: function () {
        var url = this.model.get('file');
        this.context = {
          width: this.root.width(),
          height: Math.round(this.root.width() * this.model.get("reverseRatio")),
          youtube: (url.match(/youtu/) !== null),
          vimeo: (url.match(/vimeo/) !== null),
          dailymotion: (url.match(/dailymotion/) !== null),
          videoId: url.split('/').pop()
        };
      }
    });
    return VideoView;
  });
