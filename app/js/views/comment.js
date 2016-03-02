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
    this.admin = options.admin;
    this.render();
  },

  render: function () {
    this.$el.html(template({
      'model': this.model.toJSON(),
      'admin': this.admin,
      'labels': labels
    }));
    return this;
  },

  deleteComment: function () {
    this.model.destroy();
  }
});
