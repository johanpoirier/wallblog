var Wallblog = Ember.Application.create();

//Wallblog.ApplicationAdapter = DS.FixtureAdapter.extend();

(function(Wallblog) {
    moment.lang("fr");

    Wallblog.ApplicationAdapter = DS.ActiveModelAdapter.extend({
        //host: 'http://wallblog.jops-dev.com',
        namespace: 'api'
    });

    Wallblog.ApplicationController = Ember.Controller.extend();

    /*Wallblog.ItemSerializer = DS.RESTSerializer.extend({
        normalizePayload: function(type, payload) {
            var response = {};
            response[type.typeKey] = payload;
            return response;
        }
    });*/
})(Wallblog);
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
    this.resource('item', { path: 'item/:item_id'});
});

Wallblog.ItemsRoute = Ember.Route.extend({
    setupController: function(controller) {
        controller.set('title', "Tan, Johan & Evan");
        controller.set('items', this.store.find('item', {
            limit: 12,
            offset: 0,
            comments: true
        }));
    }
});
Ember.Handlebars.registerHelper('for', function(start, end, options) {
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
Ember.Handlebars.helper('format-date', function(timestamp, outputPattern, inputPattern) {
    var defaultPattern = 'YYYY-MM-DD HH:mm:ss';
    var momentDate;

    if(timestamp) {
        if((timestamp instanceof Date) || (timestamp instanceof Array)) {
            momentDate = moment(timestamp);
        }
        else if(typeof(timestamp) === 'string') {
            if(!inputPattern || (typeof(inputPattern) !== 'string')) {
                inputPattern = defaultPattern;
            }
            momentDate = moment(timestamp, inputPattern);
        }
        else {
            return timestamp;
        }
    }
    else {
        return "";
    }

    return momentDate.format(outputPattern ? outputPattern : defaultPattern);
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
Wallblog.Comment = DS.Model.extend({
    text: DS.attr('string'),
    author: DS.attr('string'),
    date: DS.attr('string'),
    item: DS.belongsTo('item')
});
Wallblog.Item = DS.Model.extend({
    file: DS.attr('string'),
    description: DS.attr('string'),
    date: DS.attr('string'),
    ratio: DS.attr('number'),
    reverseRatio: DS.attr('number'),
    type: DS.attr('string'),
    comments: DS.hasMany('comment'),
    nbComments: function() {
        return this.get('comments').get('length');
    }.property('comments'),
    hasComments: function() {
        var comments = this.get('comments');
        return comments && (comments.get('length') > 0);
    }.property('comments')
});

Wallblog.ItemSerializer = DS.RESTSerializer.extend({
    extractSingle: function(store, type, payload, id) {
        var item = {}, commentIds = [];

        item.id = payload.id;
        item.file = payload.file;
        item.description = payload.description;
        item.date = payload.date;
        item.ratio = payload.ratio;
        item.reverseRatio = payload.reverseRatio;
        item.type = payload.type;

        // Leave the original un-normalized comments alone, but put them
        // in the right place in the payload. We'll normalize the comments
        // below in `normalizeHash`
        var comments = payload.comments.map(function(comment) {
            commentIds.push(comment.id);
            return {
                id: comment.id,
                text: comment.text,
                author: comment.author,
                date: comment.date
            };
        });

        item.comments = commentIds;

        var item_payload = { item: item, comments: comments };

        return this._super(store, type, item_payload, id);
    },

    extractArray: function(store, type, payload) {
        var items = payload;
        var comments = [];

        items.forEach(function(item) {
            var commentIds = [];
            if(item.comments) {
                comments = comments.concat(item.comments);
                item.comments.forEach(function(comment) {
                    commentIds.push(comment.id);
                });
                item.comments = commentIds;
            }
        });

        comments.forEach(function(comment) {
            delete comment.idItem;
        });

        payload = { comments: comments, items: items };

        return this._super(store, type, payload);
    }
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