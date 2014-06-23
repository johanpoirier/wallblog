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