import Backbone from 'backbone';
import ModalView from 'views/modal';
import labels from 'nls/labels';
import template from 'templates/notification';
import ServiceWorkerSubscriptions from 'sw/subscriptions';

var NotificationView = ModalView.extend({

  template: template,
  labels: labels,
  className: 'modal',

  attributes: {
    id: 'uploadModal'
  },

  events: {
    'click #modalClose': 'close',
    'click #modalCancel': 'close',
    'click #modalSubmit': 'submit'
  },

  render: function () {
    this.$el.html(template({
      'labels': labels
    }));
    this.$el.css('opacity', '1');
    return this;
  },

  submit: function (e) {
    e.preventDefault();

    this.$('button').attr('disabled', 'disabled');

    ServiceWorkerSubscriptions.subscribeUser()
      .then(() => this.remove())
      .catch(error => {
        console.warn(error);
        this.remove()
      });
  }
});

export default NotificationView;
