define(['underscore', 'backbone', 'models/comment', 'i18n!nls/labels', 'hbs!templates/comment-form'],

function(_, Backbone, Comment, labels, tmpl) {
    var CommentFormView = Backbone.View.extend({
        template: tmpl,
        labels: labels,
        className: "span10 offset1",
        strategy: "append",
        
        events: {
            "click textarea": "showFullForm",
            "click .btn-success": "submit",
            "click button[type='button']": "cancel"
        },
        
        initialize: function(options) {
            this.render();
            this.item = options.item;
            this.model = new Comment({ idItem: this.item.get("id") });
        },
        
        showFullForm: function() {
            if(this.$(".hidden:hidden").length > 0) {
                this.$(".hidden").slideToggle(400);
                this.$("textarea").attr("rows", "3");
            }
        },
        
        submit: function(event) {
            event.preventDefault();
            this.model.save({
                author: this.$("input[name='author']").val(),
                text: this.$("textarea").val()
            }, {
                success: _.bind(this.submitSuccess, this)
            });
        },
        
        cancel: function(event) {
            if(this.$(".hidden:hidden").length == 0) {
                this.hideForm();
            }
        },
        
        submitSuccess: function(comment) {
            this.item.comments.add(comment);
            this.hideForm();
        },
        
        hideForm: function() {
            this.$(".hidden").slideToggle("fast").val("");
            this.$("textarea").attr("rows", "1").val("");
        }
    });
    return CommentFormView;
});