Wallblog.Comment = DS.Model.extend({
    text: DS.attr('string'),
    author: DS.attr('string'),
    date: DS.attr('string'),
    item: DS.belongsTo('item')
});