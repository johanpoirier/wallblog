import Backbone from 'backbone';
import labels from 'nls/labels';
import ItemZoomView from 'views/item-zoom';
import pictureTmpl from 'templates/picture';
import userId from 'utils/user-id';

export default Backbone.View.extend({

  className: 'item',
  tagName: 'article',

  events: {
    'click .likes': 'like',
    'click': 'zoom'
  },

  attributes() {
    return {
      'id': this.model.get('id')
    }
  },

  initialize() {
    const file = encodeURIComponent(decodeURIComponent(this.model.get('file'))), filenameInfo = file.split('.');
    this.model.set({
      'file': file,
      'extension': filenameInfo.pop(),
      'filename': filenameInfo.join('.')
    }, { silent: true });
  },

  render() {
    this.$el.html(pictureTmpl({
      'model': this.model.toJSON(),
      'labels': labels
    }));
    return this;
  },

  zoom() {
    window.currentScollPosition = $(window.document).scrollTop();
    if (this.model.get('id') !== undefined) {
      Backbone.history.navigate('/item/' + this.model.get('id'), true);
    }
    return false;
  },

  isVisible() {
    const rect = this.el.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight + 50;
    return (rect.top >= -50) && (rect.top <= viewportHeight) || (rect.bottom >= -50) && (rect.bottom <= viewportHeight);
  },

  like(e) {
    console.debug(`${userId} likes ${this.model.toJSON()}`);
    this.model.set('likes', parseInt(this.model.get('likes'), 10) + 1);
    this.model.save();
    this.render();
    e.stopImmediatePropagation();
  }
});
