Wallblog.Comment = DS.Model.extend({
    text: DS.attr('string'),
    author: DS.attr('string'),
    date: DS.attr('string'),
    dateFormat: function() {
        return Ember.I18n.translations["dateFormat"];
    }.property(),
    item: DS.belongsTo('item')
});