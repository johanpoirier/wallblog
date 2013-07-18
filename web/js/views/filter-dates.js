define(['backbone', 'jquery', 'pubsub', 'i18n!nls/labels', 'hbs!templates/filter-dates', 'hbs!templates/filter-text'],

function(Backbone, $, PubSub, labels, tmpl, tmplMini) {
    var FilterDatesView = Backbone.View.extend({
        template: tmplMini,
        labels: labels,

        year: null,
        month: null,

        years: [ "2013", "2012", "2011" ],
        months: [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ],

        events: {
            "click": "displayDates",
            "click .month span": "selectMonth",
            "click .year span": "selectYear",
            "click button": "filter"
        },

        initialize: function() {
            this.render({ value: labels.filter, clear: false });
        },

        displayDates: function(e) {
            e.stopImmediatePropagation();
            this.template = tmpl;
            this.render({
                "years": this.years,
                "months": this.months,
                "year": this.year,
                "month": this.month
            });
            if(this.year) {
                this.$el.addClass("expanded");
            }
        },

        selectMonth: function(e) {
            e.stopImmediatePropagation();
            this.$(".month span").removeClass("selected");

            var month = this.$(e.currentTarget);
            if(!this.month || this.month !== month.html()) {
                this.$(e.currentTarget).addClass("selected");
                this.month = month.html();
            }
            else {
                this.$(e.currentTarget).removeClass("selected");
                this.month = null;
            }
        },

        selectYear: function(e) {
            e.stopImmediatePropagation();
            this.$(".year span").removeClass("selected");

            var year = this.$(e.currentTarget);
            if(!this.year || this.year !== year.html()) {
                this.$(e.currentTarget).addClass("selected");
                this.year = year.html();
                this.$(".column.month").show();
                this.$el.addClass("expanded");
            }
            else {
                this.$(e.currentTarget).removeClass("selected");
                this.year = null;
                this.month = null;
                this.$(".column.month").hide();
                this.$el.removeClass("expanded");
            }
        },

        filter: function(e) {
            e.stopImmediatePropagation();
            PubSub.trigger(AppEvents.FILTER, this.month, this.year);
            this.$el.removeClass("expanded");
            this.template = tmplMini;
            if(this.year) {
                this.render({ value: (this.month ? this.month : "") + " " + (this.year ? this.year : ""), clear: true });
            }
            else {
                this.render({ value: labels.filter, clear: false });
            }
        }
    });
    return FilterDatesView;
});