import Backbone from 'backbone';
import PubSub from 'pubsub';
import labels from 'nls/labels';
import template from 'templates/filter-button';
import filterDates from 'filter-dates';
import FilterView from 'views/filter';
import Settings from 'settings';

export default Backbone.View.extend({

  year: null,
  month: null,
  monthId: null,

  events: {
    "click": "displayFilterView",
    "click .month span": "selectMonth",
    "click .year span": "selectYear",
    "click i": "clearFilter"
  },

  initialize: function () {
    this.render();

    this.filterView = new FilterView({ 'el': this.el });
    PubSub.on(AppEvents.FILTER, this.render, this);
  },

  render: function () {
    var context;
    var filter = Settings.getFilter();
    if (filter.year) {
      this.year = filter.year;
      this.monthId = filter.monthId;
      this.month = this.monthId ? filterDates.months[parseInt(this.monthId, 10) - 1].value : "";
      context = { value: this.month + " " + (this.year || ""), clear: true };
    }
    else {
      context = { value: labels.filter, clear: false };
    }
    this.$el.removeClass('expanded');
    this.$el.html(template(context));
  },

  displayFilterView: function () {
    this.filterView.render();
  },

  clearFilter: function (e) {
    e.stopImmediatePropagation();
    Settings.clearFilter();
    this.render({ value: labels.filter, clear: false });
    PubSub.trigger(AppEvents.CLEAR_FILTER);
  }
});
