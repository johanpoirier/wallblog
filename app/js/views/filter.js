import Backbone from 'backbone';
import _ from 'underscore';
import PubSub from 'pubsub';
import labels from 'nls/labels';
import template from 'templates/filter';

export default Backbone.View.extend({

  year: null,
  month: null,
  monthId: null,

  years: ["2016", "2015", "2014", "2013", "2012", "2011"],
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

  events: {
    "click .month span": "selectMonth",
    "click .year span": "selectYear",
    "click button": "filter",
  },

  render: function (year, monthId) {
    var context = {
      'labels': labels,
      "years": this.years,
      "months": this.months
    };
    if (year) {
      context.year = year;
    }
    if (monthId) {
      context.month = _.find(this.months, function (month) { return parseInt(month.id, 10) === parseInt(monthId, 10) }).value;
    }
    this.$el.html(template(context));
    this.$el.addClass('expanded');
  },

  selectMonth: function (e) {
    e.stopImmediatePropagation();
    this.$(".month span").removeClass("selected");

    var month = this.$(e.currentTarget);
    if (!this.month || this.month !== month.html()) {
      this.$(e.currentTarget).addClass("selected");
      this.month = month.html();
      this.monthId = month.data("value");
    }
    else {
      this.$(e.currentTarget).removeClass("selected");
      this.month = null;
      this.monthId = null;
    }
  },

  selectYear: function (e) {
    e.stopImmediatePropagation();
    this.$(".year span").removeClass("selected");

    var year = this.$(e.currentTarget);
    if (!this.year || this.year !== year.html()) {
      this.$(e.currentTarget).addClass("selected");
      this.year = year.html();
      this.$(".column.month").removeClass('hidden');
      this.$el.addClass("expanded");
    }
    else {
      this.$(e.currentTarget).removeClass("selected");
      this.year = null;
      this.month = null;
      this.monthId = null;
      this.$(".column.month").addClass('hidden');
    }
  },

  filter: function (e) {
    e.stopImmediatePropagation();
    PubSub.trigger(AppEvents.FILTER, this.monthId, this.year);
  }
});
