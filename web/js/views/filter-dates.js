define(['backbone', 'jquery', 'pubsub', 'hbs!templates/filter-dates'],

function(Backbone, $, PubSub, tmpl) {
    var FilterDatesView = Backbone.View.extend({
        template: tmpl,

        year: null,
        month: null,

        years: [ "2011", "2012", "2013" ],
        months: [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ],

        events: {
            "click": "displayDates",
            "click .month span": "selectMonth",
            "click .year span": "selectYear",
            "click button": "filter"
        },

        initialize: function() {
            this.$el.html("Filtrer...");
        },

        displayDates: function(e) {
            e.stopImmediatePropagation();
            this.render({
                "years": this.years,
                "months": this.months,
                "year": this.year,
                "month": this.month
            });
        },

        selectMonth: function(e) {
            e.stopImmediatePropagation();
            this.$(".month span").removeClass("selected");

            var month = this.$(e.currentTarget);
            this.$(e.currentTarget).addClass("selected");
            this.month = month.html();
        },

        selectYear: function(e) {
            e.stopImmediatePropagation();
            this.$(".year span").removeClass("selected");

            var year = this.$(e.currentTarget);
            if(!this.year || this.year !== year.html()) {
                this.$(e.currentTarget).addClass("selected");
                this.year = year.html();
            }
            else {
                this.$(e.currentTarget).removeClass("selected");
                this.year = null;
            }
        },

        filter: function(e) {
            e.stopImmediatePropagation();
            PubSub.trigger(AppEvents.FILTER, this.month, this.year);
            this.$el.html((this.month ? this.month : "") + " " + (this.year ? this.year : ""));
        }
    });
    return FilterDatesView;
});