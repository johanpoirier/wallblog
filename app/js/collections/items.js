import backbone from 'backbone';
import Item from 'models/item';

export default Backbone.Collection.extend({
  model: Item,
  url: 'api/item'
});