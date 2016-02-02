import backbone from 'backbone';
import PubSub from 'pubsub';
import labels from 'nls/labels';
import tmpl from 'templates/filter-dates';
import tmplMini from 'templates/filter-text';

export default Backbone.View.extend({
  template: tmplMini,
  labels: labels,

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
    "click": "displayDates",
    "click .month span": "selectMonth",
    "click .year span": "selectYear",
    "click button": "filter",
    "click i": "clearFilter"
  },

  initialize: function (options) {
    if (options.filter) {
      this.template = tmplMini;
      this.year = options.filter.year;
      this.monthId = options.filter.monthId;
      this.month = this.monthId ? this.months[parseInt(this.monthId, 10) - 1].value : "";
      this.render({ value: this.month + " " + (this.year || ""), clear: true });
    }
    else {
      this.render({ value: labels.filter, clear: false });
    }
  },

  displayDates: function (e) {
    if (!this.$el.hasClass("expanded")) {
      e.stopImmediatePropagation();
      this.template = tmpl;
      this.render({
        "years": this.years,
        "months": this.months,
        "year": this.year,
        "month": this.month
      });
      this.$el.addClass("expanded");
    }
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
    this.renderMini({ 'monthId': this.monthId, 'year': this.year });
  },

  renderMini: function (values) {
    values = values || {};
    if (values.monthId) {
      values.month = this.months[parseInt(values.monthId, 10) - 1].value;
    }
    this.$el.removeClass("expanded");
    this.template = tmplMini;
    if (values.year) {
      this.render({ value: (values.month || "") + " " + (values.year || ""), clear: true });
    }
    else {
      this.render({ value: labels.filter, clear: false });
    }
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
