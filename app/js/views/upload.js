define(['backbone',
    'views/modal',
    'i18n!nls/labels',
    'hbs!templates/upload'],

  function (Backbone, ModalView, labels, template) {
    var UploadView = ModalView.extend({

      template: template,
      labels: labels,
      root: "body",

      attributes: {
        id: "uploadModal"
      },

      events: {
        'click #modalClose': 'close',
        'click #modalCancel': 'close',
        'submit': "submit"
      },

      initialize: function () {
        this.render();
        this.$el.css('opacity', '1');
      },

      render: function () {
        UploadView.__super__.render.apply(this, [{
          pictures: this.options.pictures
        }]);
      },

      submit: function (e) {
        e.preventDefault();

        this.$(".btn").attr("disabled", "disabled");
        this.$(".icon-white").removeClass("icon-white").addClass("icon-upload");
        for (var i = 0; i < this.options.pictures.length; i++) {
          this.options.pictures[i].description = this.$("input[name='description-" + this.options.pictures[i].id + "']").val();
        }
        $.ajax({
          type: "POST",
          url: "api/items",
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify(this.options.pictures),
          success: _.bind(function () {
            this.$el.modal('hide');
            Pubsub.trigger(AppEvents.ITEMS_UPLOADED);
          }, this)
        });
      }
    });
    return UploadView;
  });