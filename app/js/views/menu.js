import Backbone from 'backbone';
import PubSub from 'utils/pubsub';
import Events from 'utils/events';
import FilterView from 'views/filter';
import labels from 'nls/labels';
import template from 'templates/menu';

export default Backbone.View.extend({

  initialize: function () {
    Pubsub.on(Events.MENU_TOGGLE, this.toggleMenu, this);
    Pubsub.on(Events.FILTER, this.hideMenu, this);
    this.render();
  },

  toggleMenu: function() {
    this.$el.hasClass('displayed') ? this.hideMenu() : this.$el.addClass('displayed');
  },

  hideMenu: function() {
    this.$el.removeClass('displayed');
  },

  render: function () {
    this.$el.html(template({
      'labels': labels
    }));
    this.filterView = new FilterView({ 'el': this.$('.filter-content') });
    this.filterView.render();

    return this;
  }
});
