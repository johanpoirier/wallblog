define(['backbone', 'i18n!nls/labels', 'hbs!templates/comment'],

function(Backbone, labels, tmpl) {
    var CommentView = Backbone.View.extend({
        template: tmpl,
        labels: labels,
        className: 'comment',
        strategy: 'prepend',
        
        events: {
            'click .delete': 'deleteComment'
        },
        
        initialize: function() {
            this.model.on('destroy', this.remove, this);
            this.render();
            if(this.options.admin) {
                this.$('span.delete').show();
            }
        },
        
        deleteComment: function() {
            this.model.destroy();
        }
    });
    return CommentView;
});