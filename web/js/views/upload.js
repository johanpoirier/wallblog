define(['backbone',
    'i18n!nls/labels',
    'hbs!templates/upload'],

    function(Backbone, labels, tmpl) {
        var UploadView = Backbone.View.extend({
        
            template: tmpl,
            labels: labels,
            root: "#modal",
            tagName: "div",
            className: "modal largeModal",
            
            attributes: {
                id: "uploadModal",
                tabindex: "-1",
                role: "dialog",
                "aria-labelledby": "Upload pics",
                "aria-hidden": "true"
            },
            
            events: {
                submit: "submit"
            },

            initialize: function() {
                this.render();
                this.$el.modal();
            },

            render: function() {
                UploadView.__super__.render.apply(this, [{
                    pictures: this.options.pictures
                }]);
            },
            
            submit: function(e) {
                e.preventDefault();
                
                this.$(".btn").attr("disabled", "disabled");
                this.$(".icon-white").removeClass("icon-white").addClass("icon-upload");
                for(var i=0; i<this.options.pictures.length; i++) {
                    this.options.pictures[i].description = this.$("input[name='description-" + this.options.pictures[i].id + "']").val();
                }
                $.ajax({
                    type: "POST",
                    url: "api/items",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(this.options.pictures),
                    success: _.bind(function() {
                        this.$el.modal('hide');
                        Pubsub.trigger(AppEvents.ITEMS_UPLOADED);
                    }, this)
                });
            }
        });
        return UploadView;
    });