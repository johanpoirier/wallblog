Ember.TextField.reopen(Ember.I18n.TranslateableAttributes);

Wallblog.CommentFormView = Ember.View.extend({

    tagName: 'div',
    classNames: ['row commentForm'],
    templateName: 'comment-form',

    isExpanded: false,

    actions: {
        expand: function() {
            this.$("textarea").attr("rows", "3");
            this.set("isExpanded", true);
        },

        contract: function() {
            this.$("textarea").attr("rows", "1");
            this.$("input,textarea").val("");
            this.set("isExpanded", false);
        },

        submitComment: function() {
            var newComment = {
                author: this.$("input[name='author']").val(),
                text: this.$("textarea").val()
            }
            this.get('controller').send("createComment", newComment);

            this.$("textarea").attr("rows", "1");
            this.$("input,textarea").val("");
            this.set("isExpanded", false);
        }
    }
});