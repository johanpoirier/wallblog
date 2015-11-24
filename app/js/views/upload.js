define(['backbone',
    'views/modal',
    'i18n!nls/labels',
    'hbs!templates/upload'],

  function (Backbone, ModalView, labels, template) {
    var UploadView = ModalView.extend({

      template: template,
      labels: labels,
      strategy: 'append',
      root: 'body',
      className: 'large modal',

      attributes: {
        id: 'uploadModal'
      },

      events: {
        'click #modalClose': 'close',
        'click #modalCancel': 'close',
        'click #modalSubmit': 'submit',
        'submit form': 'submit'
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

        this.$('button').attr('disabled', 'disabled');
        this.$('button.primary').addClass('upload');
        var i = 0;
        for (i; i < this.options.pictures.length; i += 1) {
          this.options.pictures[i].description = this.$("input[name='description-" + this.options.pictures[i].id + "']").val();
        }
        $.ajax({
          type: 'POST',
          url: 'api/items',
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(this.options.pictures),
          success: function () {
            this.close();
            Pubsub.trigger(AppEvents.ITEMS_UPLOADED);
          }.bind(this)
        });
      },

      close: function () {
        this.remove();
      }
    });
    return UploadView;
  });
