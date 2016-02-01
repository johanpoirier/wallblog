import backbone from 'backbone';
import labels from 'nls/labels';
import template from 'templates/comment';

export default Backbone.View.extend({

  className: 'comment',

  events: {
    'click .delete': 'deleteComment'
  },

  initialize: function (options) {
    this.model.on('destroy', this.remove, this);
    this.render();
    if (options.admin) {
      this.$('span.delete').show();
    }
  },

  render: function () {
    this.$el.html(template({
      'model': this.model.toJSON(),
      'labels': labels
    }));
    return this;
  },

  deleteComment: function () {
    this.model.destroy();
  }
});
