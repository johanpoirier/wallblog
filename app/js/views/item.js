import Backbone from 'backbone';
import labels from 'nls/labels';
import ItemZoomView from 'views/item-zoom';
import pictureTmpl from 'templates/picture';

export default Backbone.View.extend({

  className: 'item',
  tagName: 'article',

  events: {
    'click': 'zoom'
  },

  attributes: function () {
    return {
      'id': this.model.get('id')
    }
  },

  initialize: function () {
    var file = encodeURIComponent(decodeURIComponent(this.model.get('file'))), filenameInfo = file.split('.');
    this.model.set({
      'file': file,
      'extension': filenameInfo.pop(),
      'filename': filenameInfo.join('.')
    }, { silent: true });
  },

  render: function () {
    var context = {
      'model': this.model.toJSON(),
      'labels': labels
    };
    this.$el.html(pictureTmpl(context));
    return this;
  },

  zoom: function () {
    window.currentScollPosition = $(window.document).scrollTop();
    if (this.model.get('id') !== undefined) {
      Backbone.history.navigate('/item/' + this.model.get('id'), true);
    }
    return false;
  }
});
