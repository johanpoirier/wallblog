import ItemView from 'views/item';
import labels from 'nls/labels';
import videoTmpl from 'templates/video';

var VideoView = ItemView.extend({

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

export default VideoView;
