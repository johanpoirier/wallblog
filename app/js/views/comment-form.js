define(['underscore', 'backbone', 'models/comment', 'i18n!nls/labels', 'hbs!templates/comment-form'],

function(_, Backbone, Comment, labels, tmpl) {
    var CommentFormView = Backbone.View.extend({
        template: tmpl,
        labels: labels,
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
            if(this.$(".masked:hidden").length > 0) {
                this.$(".masked").slideToggle(400);
                this.$("textarea").attr("rows", "3");
            }
        },

        submit: function(event) {
            event.preventDefault();
            
            var author = this.$("input[name='author']").val();
            var text = this.$("textarea").val();
            
            if(author === "") {
                this.$(".help-inline").html("Veuillez entrer votre nom");
            }
            else {
                this.model.save({
                    "author": author,
                    "text": text
                }, {
                    success: _.bind(this.submitSuccess, this)
                });
            }
        },
        
        cancel: function(event) {
            if(this.$(".masked:hidden").length === 0) {
                this.hideForm();
            }
        },
        
        submitSuccess: function(comment) {
            this.item.comments.add(comment);
            this.model = new Comment({ idItem: this.item.get("id") });
            this.hideForm();
        },
        
        hideForm: function() {
            this.$(".masked").slideToggle("fast");
            this.$(".help-inline").html("");
            this.$("input[type='text']").val("");
            this.$("textarea").attr("rows", "1").val("");
        }
    });
    return CommentFormView;
});