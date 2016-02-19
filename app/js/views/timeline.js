import _ from 'underscore';
import Backbone from 'backbone';
import PubSub from 'utils/pubsub';
import Events from 'utils/events';
import moment from 'moment';
import template from 'templates/timeline';

export default Backbone.View.extend({

  tagName: 'aside',

  inputPattern: 'YYYY-MM-DD HH:mm:ss',
  outputPattern: 'MMMM',

  initialize: function () {
    this.bottom = 0;
    this.markers = [];
    this.lastMarkerDate = Date.now();

    PubSub.on(Events.ADD_MARKER, this.addMarker, this);
  },

  render: function () {
    this.$el.html(template({ 'markers': this.markers }));
    this.$el.height(this.bottom + 'px');

    return this;
  },

  addMarker: function (marker) {
    var markerDate = moment(marker.date, this.inputPattern);

    // new marker older than the last added -> empty list
    if (markerDate.valueOf() > this.lastMarkerDate) {
      this.markers = [];
      this.bottom = 0;
    }

    // marker with an another month : add it and display
    var date = markerDate.format('YYYY-MM');
    if (this.markers.length === 0 || this.markers[this.markers.length - 1].date !== date) {
      this.markers.push({
        'top': Math.round(marker.top),
        'label': markerDate.format(this.outputPattern),
        'date': date
      });
    }

    // timeline must have the same height as the wall
    if (this.bottom !== marker.bottom) {
      this.bottom = marker.bottom;
      this.render();
    }

    this.lastMarkerDate = markerDate.valueOf();
  },

  remove: function () {
    PubSub.off(Events.ADD_MARKER);
    Backbone.View.prototype.remove.apply(this, arguments);
  }

});
