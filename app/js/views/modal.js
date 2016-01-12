import Backbone from 'backbone';
import template from 'templates/modal';

export default Backbone.View.extend({
  template: template,
  className: 'modal',
  events: {
    'click #modalClose': 'close'
  },

  close: function () {
    this.$el.remove();
  }
});