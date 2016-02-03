import Backbone from 'backbone';
import PubSub from 'pubsub';
import FilterDatesView from 'views/filter-dates';
import labels from 'nls/labels';
import template from 'templates/menu';

export default Backbone.View.extend({

  years: ['2016', '2015', '2014', '2013', '2012', '2011'],
  months: [
    { id: "01", value: "Janvier" },
    { id: "02", value: "Février" },
    { id: "03", value: "Mars" },
    { id: "04", value: "Avril" },
    { id: "05", value: "Mai" },
    { id: "06", value: "Juin" },
    { id: "07", value: "Juillet" },
    { id: "08", value: "Août" },
    { id: "09", value: "Septembre" },
    { id: "10", value: "Octobre" },
    { id: "11", value: "Novembre" },
    { id: "12", value: "Décembre" }],

  initialize: function () {
    Pubsub.on(AppEvents.MENU_TOGGLE, this.toggleMenu, this);
    this.render();
  },

  toggleMenu: function() {
    this.$el.hasClass('displayed') ? this.$el.removeClass('displayed') : this.$el.addClass('displayed');
  },

  render: function () {
    this.$el.html(template({
      'labels': labels,
      'years': this.years,
      'months': this.months
    }));
    return this;
  }
});
