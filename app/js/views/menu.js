import Backbone from 'backbone';
import PubSub from 'pubsub';

export default Backbone.View.extend({

  initialize: function () {
    Pubsub.on(AppEvents.MENU_TOGGLE, this.toggleMenu, this);
  },

  toggleMenu: function() {
    this.$el.hasClass('displayed') ? this.$el.removeClass('displayed') : this.$el.addClass('displayed');
  },

  render: function () {
    return this;
  }
});
