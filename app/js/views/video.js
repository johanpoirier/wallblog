import ItemView from 'views/item';
import labels from 'nls/labels';
import template from 'templates/video';

export default ItemView.extend({

  className: "item",

  events: {
    'click .click-overlay': 'zoom'
  },

  initialize: function () {
    var url = this.model.get('file');
    this.context = {
      'youtube': (url.match(/youtu/) !== null),
      'vimeo': (url.match(/vimeo/) !== null),
      'dailymotion': (url.match(/dailymotion/) !== null),
      'videoId': url.split('/').pop()
    };
  },

  render: function () {
    this.context.model = this.model.toJSON();
    this.context.labels = labels;
    this.$el.html(template(this.context));
    return this;
  }
});
