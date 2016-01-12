import backbone from 'backbone';
import Comment from 'models/comment';

export default Backbone.Collection.extend({
  model: Comment,

  initialize: function (options) {
    this.url = "/api/item/" + options.item.get("id") + "/comments";
  }
});