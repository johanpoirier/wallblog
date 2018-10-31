import Backbone from 'backbone';
import ModalView from 'views/modal';
import labels from 'nls/labels';
import template from 'templates/upload';
import Events from 'utils/events';

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
    'click #modalSubmit': 'submit'
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
      url: 'api/pictures',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(this.pictures),
      success: () => {
        Pubsub.trigger(Events.ITEMS_UPLOADED);
        this.remove();
      }
    });
  }
});

export default UploadView;
