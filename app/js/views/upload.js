import Backbone from 'backbone';
import ModalView from 'views/modal';
import labels from 'nls/labels';
import template from 'templates/upload';

var UploadView = ModalView.extend({

  template: template,
  labels: labels,
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

  render: function (pictures) {
    this.pictures = pictures;
    this.$el.html(template({
      'pictures': pictures,
      'labels': labels
    }));
    this.$el.css('opacity', '1');
    return this;
  },

  submit: function (e) {
    e.preventDefault();

    this.$('button').attr('disabled', 'disabled');
    this.$('button.primary').addClass('upload');
    var i = 0;
    for (i; i < this.pictures.length; i += 1) {
      this.pictures[i].description = this.$("input[name='description-" + this.pictures[i].id + "']").val();
    }
    $.ajax({
      type: 'POST',
      url: 'api/items',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(this.pictures),
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

export default UploadView;
