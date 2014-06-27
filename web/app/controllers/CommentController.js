Wallblog.CommentController = Ember.ObjectController.extend({

    needs: ['application'],

    isLogged: function() {
        console.debug("is logged : ", this.get("controllers.application").get("isLogged"));
    }.property(),

    dateFormat: function() {
        return Ember.I18n.translations["dateFormat"];
    }.property(),

    actions: {
        "delete": function() {
            var comment = this.get('model');
            comment.deleteRecord();
            comment.save();
        }
    }
});