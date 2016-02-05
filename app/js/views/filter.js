import Backbone from 'backbone';
import _ from 'underscore';
import PubSub from 'pubsub';
import labels from 'nls/labels';
import filterDates from 'filter-dates';
import Settings from 'settings';
import template from 'templates/filter';

export default Backbone.View.extend({

  year: null,
  month: null,
  monthId: null,

  events: {
    'click .month': 'selectMonth',
    'click .year': 'selectYear',
    'click button': 'filter',
  },

  initialize: function () {
    PubSub.on(AppEvents.FILTER, this.render, this);
    PubSub.on(AppEvents.CLEAR_FILTER, this.render, this);
  },

  render: function () {
    var context = {
      'labels': labels,
      'years': filterDates.years,
      'months': filterDates.months
    };

    this.filter = Settings.getFilter();

    if (this.filter.year) {
      context.year = parseInt(this.filter.year, 10);
    }
    if (this.filter.monthId) {
      context.month = _.find(filterDates.months, function (month) {
        return parseInt(month.id, 10) === parseInt(this.filter.monthId, 10)
      }.bind(this)).value;
    }

    this.$el.html(template(context));
    this.$el.addClass('expanded');
  },

  selectMonth: function (e) {
    e.stopImmediatePropagation();
    this.$('.month').removeClass('selected');

    var month = this.$(e.currentTarget);
    if (!this.filter.month || this.filter.month !== month.html()) {
      this.$(e.currentTarget).addClass('selected');
      this.filter.month = month.html();
      this.filter.monthId = month.data('value');
    }
    else {
      this.$(e.currentTarget).removeClass('selected');
      this.filter.month = null;
      this.filter.monthId = null;
    }
  },

  selectYear: function (e) {
    e.stopImmediatePropagation();
    this.$('.year').removeClass('selected');

    var year = this.$(e.currentTarget);
    if (!this.filter.year || this.filter.year !== year.html()) {
      this.$(e.currentTarget).addClass('selected');
      this.filter.year = year.html();
      this.$('.months').removeClass('hidden');
      this.$el.addClass('expanded');
    }
    else {
      this.$(e.currentTarget).removeClass('selected');
      this.filter = {};
      this.$('.months').addClass('hidden');
    }
  },

  filter: function (e) {
    Settings.saveFilter(this.filter);
    e.stopImmediatePropagation();
    PubSub.trigger(AppEvents.FILTER);
  }
});
