import backbone from 'backbone';
import Item from 'models/item';

export default Backbone.Collection.extend({
  model: Item,
  url: 'api/item',

  resetRender: function () {
    this.models.forEach(function (model) {
      model.set('rendered', false, { 'silent': true });
    });
  }
});