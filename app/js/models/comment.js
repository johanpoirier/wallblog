import backbone from 'backbone';

export default Backbone.Model.extend({
  initialize: function () {
    this.urlRoot = "/api/item/" + this.get("idItem") + "/comments";
  }
});
