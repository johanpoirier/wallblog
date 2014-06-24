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