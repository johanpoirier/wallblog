Wallblog.ItemController = Ember.ObjectController.extend({

    needs: ['application'],

    isEditing: false,

    // Computed properties
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
    }.property('comments'),

    sortedComments: function() {
        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
            sortProperties: ['date'],
            sortAscending: false,
            content: this.get('comments')
        });
    }.property('comments'),

    actions: {
        createComment: function(newComment) {
            newComment["item"] = this.get("model");
            newComment["date"] = moment().format("YYYY-MM-DD HH:mm:ss");
            var comment = this.store.createRecord('Comment', newComment);
            comment.save();
        },

        edit: function() {
            this.set("isEditing", true);
        },

        unedit: function() {
            this.set("isEditing", false);
        },

        update: function() {
            var item = this.get("model");
            console.debug(item.get("description"));
            item.save().then(_.bind(function() {
                this.set("isEditing", false);
            }, this));
        }
    }
});