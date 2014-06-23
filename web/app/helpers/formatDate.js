Handlebars.registerHelper('format-date', function(date, end, options) {
    return moment(date).fromNow();
});