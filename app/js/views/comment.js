import backbone from 'backbone';
import labels from 'nls/labels';
import template from 'templates/comment';

export default Backbone.View.extend({
  template: template,
  labels: labels,
  className: 'comment',
  strategy: 'prepend',

  events: {
    'click .delete': 'deleteComment'
  },

  initialize: function () {
    this.model.on('destroy', this.remove, this);
    this.render();
    if (this.options.admin) {
      this.$('span.delete').show();
    }
  },

  deleteComment: function () {
    this.model.destroy();
  }
});
