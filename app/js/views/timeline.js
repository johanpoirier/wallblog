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

  colors: [ '#FDB67F', '#FFCB1A', '#99B83D', '#97BC21', '#FBB3B6', '#FD4C1A', '#B14F06', '#3C9AD7', '#DC569F', '#FD9808', '#CC9109', '#342F11' ],

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
    const markerDate = moment(marker.date, this.inputPattern);

    // new marker older than the last added -> empty list
    if (markerDate.valueOf() > this.lastMarkerDate) {
      this.markers = [];
      this.bottom = 0;
    }

    // marker with an another month : add it and display
    const date = markerDate.format('YYYY-MM');
    if (this.markers.length === 0 || (this.markers[this.markers.length - 1]['top'] !== Math.round(marker.top))) {
      this.markers.push({
        'top': Math.round(marker.top),
        'label': markerDate.format(this.outputPattern),
        'color': this.colors[parseInt(markerDate.format('M'), 10) - 1],
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
