Wallblog.CommentController = Ember.ObjectController.extend({
    dateFormat: function() {
        return Ember.I18n.translations["dateFormat"];
    }.property()
});