define(['backbone', 'hbs!templates/modal'],

  function (Backbone, template) {
    var ModalView = Backbone.View.extend({
      template: template,
      className: 'modal',
      events: {
        'click #modalClose': 'close'
      },

      close: function () {
        this.$el.remove();
      }
    });

    return ModalView;
  });
