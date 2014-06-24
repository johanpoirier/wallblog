Ember.Handlebars.registerHelper('ifequals', function(value1, value2, options) {
    if (value1 === value2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Ember.Handlebars.registerHelper('unlessequals', function(value1, value2, options) {
    var fn = options.fn;
    options.fn = options.inverse;
    options.inverse = fn;

    return Ember.Handlebars.helpers['ifequals'].call(this, value1, value2, options);
});