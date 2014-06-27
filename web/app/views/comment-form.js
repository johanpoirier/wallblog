Ember.TextField.reopen(Ember.I18n.TranslateableAttributes);

Wallblog.CommentFormView = Ember.View.extend({

    tagName: 'div',
    classNames: ['row commentForm'],
    templateName: 'comment-form',

    // form state vars
    nbRows: 1,
    isExpanded: function() {
        return this.get("nbRows") === 3;
    }.property("nbRows"),

    // new comment data
    author: "",
    text: "",

    actions: {
        expand: function() {
            this.set('nbRows', 3);
        },

        contract: function() {
            // clean comment form
            this.setProperties({
                'nbRows': 1,
                'author': "",
                'text': ""
            });
        },

        submitComment: function() {
            this.get('controller').send("createComment", {
                author: this.get('author'),
                text: this.get('text')
            });

            // clean comment form
            this.setProperties({
                'nbRows': 1,
                'author': "",
                'text': ""
            });
        }
    }
});