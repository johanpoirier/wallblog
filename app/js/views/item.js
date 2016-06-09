import Backbone from 'backbone';
import labels from 'nls/labels';
import Like from 'models/like';
import pictureTmpl from 'templates/picture';
import visitor from 'utils/visitor';

export default Backbone.View.extend({

  className: 'item',
  tagName: 'article',

  events: {
    'click .likes': 'iLikeIt',
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
      'liked': visitor.doesLike(this.model.get('id')),
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

  iLikeIt(e) {
    if (!visitor.doesLike(this.model.get('id'))) {
      visitor.addLike(this.model.get('id'));
      let like = new Like({ 'itemId': this.model.get('id') });
      like.save({ 'visitorId': visitor.getUuid() }, {
        'success': () => {
          this.model.set('likes', parseInt(this.model.get('likes'), 10) + 1);
          this.render();
        }
      });
    }
    this.render();
    e.stopImmediatePropagation();
  }
});
