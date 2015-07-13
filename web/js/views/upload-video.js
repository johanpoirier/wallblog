define(['backbone',
        'jquery',
        'i18n!nls/labels',
        'hbs!templates/upload-video'],

    function(Backbone, $, labels, tmpl) {
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
                this.formats = [
                    { ext: "dailymotion", label: labels["video-dailymotion"], placeholder: labels["videoUrlPlaceholder"] },
                    { ext: "youtube", label: labels["video-youtube"], placeholder: labels["videoUrlPlaceholder"] },
                    { ext: "vimeo", label: labels["video-vimeo"], placeholder: labels["videoUrlPlaceholder"] }
                ]
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

                var videos = [];
                var videoInputs = this.$el.find("input[type='url']");
                var el = this.$el;
                videoInputs.each(function() {
                    var inputEl = $(this);
                    if (inputEl.val().length > 0) {
                        videos.push({
                            'url': inputEl.val(),
                            'type': inputEl.attr('id').split('-').pop(),
                            'date': el.find("input[name='" + inputEl.attr('id') + "-date']").val(),
                            'description': el.find("input[name='" + inputEl.attr('id') + "-description']").val()
                        });
                    }
                });

                $.ajax({
                    type: "POST",
                    url: "api/videos",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(videos),
                    success: _.bind(function() {
                        this.$el.modal('hide');
                        Pubsub.trigger(AppEvents.ITEMS_UPLOADED);
                    }, this)
                });
            }
        });
        return UploadVideoView;
    });