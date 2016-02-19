import Backbone from 'backbone';
import ModalView from 'views/modal';
import labels from 'nls/labels';
import template from 'templates/upload-video';
import Events from 'utils/events';

export default ModalView.extend({

  attributes: {
    id: 'uploadModal'
  },

  events: {
    'click #modalClose': 'close',
    'click #modalCancel': 'close',
    'click #modalSubmit': 'submit'
  },

  initialize: function () {
    this.formats = [
      { ext: "dailymotion", label: labels["video-dailymotion"], placeholder: labels["videoUrlPlaceholder"] },
      { ext: "youtube", label: labels["video-youtube"], placeholder: labels["videoUrlPlaceholder"] },
      { ext: "vimeo", label: labels["video-vimeo"], placeholder: labels["videoUrlPlaceholder"] }
    ]
    this.render();
    this.$el.css('opacity', '1');
  },

  render: function () {
    this.$el.html(template({
      'formats': this.formats,
      'labels': labels
    }));
  },

  submit: function (e) {
    e.preventDefault();

    this.$(".btn").attr("disabled", "disabled");
    this.$(".icon-white").removeClass("icon-white").addClass("icon-upload");

    var videos = [];
    var videoInputs = this.$el.find("input[type='url']");
    var el = this.$el;
    videoInputs.each(function () {
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
      success: () => {
        this.close();
        Pubsub.trigger(Events.ITEMS_UPLOADED);
      }
    });
  },

  close: function () {
    this.remove();
  }
});
