define(['backbone', 'i18n!nls/labels', 'hbs!templates/comment'],

function(Backbone, labels, tmpl) {
    var CommentView = Backbone.View.extend({
        template: tmpl,
        labels: labels,
        className: "span10 offset1 comment",
        strategy: "prepend",
        
        initialize: function() {
            this.render();
        }
    });
    return CommentView;
});