import backbone from 'backbone';
import CommentView from 'views/comment';
import tools from 'tools';

export default Backbone.View.extend({

  initialize: function () {
    this.render();
    this.collection.on("add", this.renderComment, this);
  },

  render: function () {
    this.$el.html("");
    this.collection.each(this.renderComment, this);
  },

  renderComment: function (comment) {
    var view = new CommentView({ model: comment, root: this.el, admin: tools.isLogged() });
    this.$el.append(view.el);
  }
});
