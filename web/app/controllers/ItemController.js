Wallblog.ItemController = Ember.ObjectController.extend({
    dateFormat: function() {
        return Ember.I18n.translations["dateFormat"];
    }.property(),
    nbComments: function() {
        var comments = this.get('comments');
        return comments ? this.get('comments').get('length') : 0;
    }.property('comments'),
    hasComments: function() {
        var comments = this.get('comments');
        return comments && (comments.get('length') > 0);
    }.property('comments')
});