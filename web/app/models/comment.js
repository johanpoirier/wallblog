Wallblog.Comment = DS.Model.extend({
    text: DS.attr('string'),
    author: DS.attr('string'),
    date: DS.attr('string'),
    dateFormat: function() {
        return Ember.I18n.translations["dateFormat"];
    }.property(),
    item: DS.belongsTo('item')
});

Wallblog.CommentSerializer = DS.RESTSerializer.extend({
    serialize: function(post) {
        var json = {
            author: post.get('author'),
            text: post.get('text'),
            date: post.get('date'),
            idItem: post.get('item').get('id')
        }
        return json;
    }
});