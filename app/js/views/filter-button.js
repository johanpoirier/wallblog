import Backbone from 'backbone';
import PubSub from 'pubsub';
import labels from 'nls/labels';
import template from 'templates/filter-button';
import filterDates from 'filter-dates';
import FilterView from 'views/filter';

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

  initialize: function (options) {
    if (options.filter) {
      this.year = options.filter.year;
      this.monthId = options.filter.monthId;
      this.month = this.monthId ? filterDates.months[parseInt(this.monthId, 10) - 1].value : "";
      this.render({ value: this.month + " " + (this.year || ""), clear: true });
    }
    else {
      this.render({ value: labels.filter, clear: false });
    }

    this.filterView = new FilterView({ 'el': this.el });
    PubSub.on(AppEvents.FILTER, this.refresh, this);
  },

  render: function () {
    var context;
    if (this.filter) {
      this.year = this.filter.year;
      this.monthId = this.filter.monthId;
      this.month = this.monthId ? filterDates.months[parseInt(this.monthId, 10) - 1].value : "";
      context = { value: this.month + " " + (this.year || ""), clear: true };
    }
    else {
      context = { value: labels.filter, clear: false };
    }
    this.$el.removeClass('expanded');
    this.$el.html(template(context));
  },

  refresh: function(monthId, year) {
    this.filter = {
      'monthId': monthId,
      'year': year
    };
    this.render();
  },

  displayFilterView: function () {
    this.filterView.render(this.year, this.monthId);
  },

  clearFilter: function (e) {
    e.stopImmediatePropagation();
    this.year = null;
    this.month = null;
    this.monthId = null;
    this.render({ value: labels.filter, clear: false });
    PubSub.trigger(AppEvents.CLEAR_FILTER);
  }
});
