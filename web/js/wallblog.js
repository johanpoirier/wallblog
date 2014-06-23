var Wallblog = Ember.Application.create();

Wallblog.ApplicationAdapter = DS.FixtureAdapter.extend();
AppEvents = {
    ITEMS_ADDED:    'ItemsAdded',
    ITEMS_UPLOADED: 'ItemsUploaded',
    ITEM_ZOOMED:    'ItemZoomed',
    USER_LOGGED_IN: 'UserLoggedIn',
    NO_IMAGE:       'NoImage',
    FILTER:         'Filter',
    CLEAR_FILTER:   'ClearFilter'
};
Wallblog.Router.map(function() {
    this.resource('items', { path: '/' });
});

Wallblog.ItemsRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('item');
    }
});
Handlebars.registerHelper('for', function(start, end, options) {
    var fn = options.fn, inverse = options.inverse;
    var isStartValid = (start != undefined && !isNaN(parseInt(start)) && start >= 0);
    var isEndValid = (end != undefined && !isNaN(parseInt(end)) && end >= 0);
    var ret = "";

    if (isStartValid && isEndValid && parseInt(start) <= parseInt(end)) {
        for (var i = start; i <= end; i++) {
            ret = ret + fn(i);
        }
    } else {
        ret = inverse(this);
    }

    return ret;
});
Handlebars.registerHelper('format-date', function(date, end, options) {
    return moment(date).fromNow();
});
Wallblog.Column = DS.Model.extend();

Wallblog.Column.FIXTURES = [
    {
        id: 1
    },
    {
        id: 2
    },
    {
        id: 3
    }
];
Wallblog.Item = DS.Model.extend({
    file: DS.attr('string'),
    description: DS.attr('string'),
    date: DS.attr('date'),
    ratio: DS.attr('number'),
    reverseRatio: DS.attr('number'),
    type: DS.attr('string')
});

Wallblog.Item.FIXTURES = [
    {
        id: 1,
        file: "2011_09_25_17_54_25 - 1004.jpg",
        description: "Tête à tête",
        date: "2011-09-25 17:54:25",
        ratio: 1.0,
        reverseRatio: 1.0,
        type: "picture"
    },
    {
        id: 2,
        file: "2011_09_25_18_38_11 - 1062.jpg",
        description: "In love",
        date: "2011-09-25 18:38:11",
        ratio: 1.50,
        reverseRatio: 0.66,
        type: "picture"
    },
    {
        id: 3,
        file: "2011_11_02_12_08_00.jpg",
        description: "Coiffure",
        date: "2011-11-02 12:08:04",
        ratio: 0.75,
        reverseRatio: 1.33,
        type: "picture"
    }
];