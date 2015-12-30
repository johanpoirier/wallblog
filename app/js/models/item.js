import backbone from 'backbone';
import CommentCollection from 'collections/comments';

export default Backbone.Model.extend({
  urlRoot: "/api/item",

  defaults: {
    type: "picture"
  },

  initialize: function() {
    this.comments = new CommentCollection({ item: this });
  },

  fetchComments: function() {
    this.comments.fetch();
  }
});
