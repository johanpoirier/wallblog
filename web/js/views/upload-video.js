define(['backbone',
    'i18n!nls/labels',
    'hbs!templates/upload-video'],

    function(Backbone, labels, tmpl) {
        var UploadVideoView = Backbone.View.extend({
        
            template: tmpl,
            labels: labels,
            root: "#modal",
            tagName: "div",
            className: "modal",
            
            attributes: {
                id: "uploadModal",
                tabindex: "-1",
                role: "dialog",
                "aria-labelledby": "Upload videos",
                "aria-hidden": "true"
            },
            
            events: {
                submit: "submit"
            },

            initialize: function() {
                this.formats = [ { ext: "ogv", label: labels["video-ogv"] }, { ext: "mp4", label: labels["video-mp4"] }, { ext: "webm", label: labels["video-webm"] } ]
                this.render();
                this.$el.modal();
            },

            render: function() {
                UploadVideoView.__super__.render.apply(this, [{
                    formats: this.formats
                }]);
            },
            
            submit: function(e) {
                e.preventDefault();
                
                this.$(".btn").attr("disabled", "disabled");
                this.$(".icon-white").removeClass("icon-white").addClass("icon-upload");

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
        return UploadVideoView;
    });