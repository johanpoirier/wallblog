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
    this.reset();

    PubSub.on(Events.ADD_MARKER, this.addMarker, this);
    PubSub.on(Events.FILTER, this.reset, this);
  },

  render: function () {
    this.$el.html(template({ 'markers': this.markers }));

    return this;
  },

  reset: function () {
    this.markers = [];
    this.lastMarkerDate = Date.now();
  },

  addMarker: function (marker) {
    const markerDate = moment(marker.date, this.inputPattern);

    // new marker older than the last added -> empty list
    if (markerDate.valueOf() > this.lastMarkerDate) {
      this.markers = [];
    }

    // marker with an another month : add it and display
    const date = markerDate.format('YYYY-MM');
    const label = markerDate.format(this.outputPattern);
    if (this.markers.length === 0 || (this.markers[this.markers.length - 1]['line'] !== marker.line)) {
      this.markers.push({
        'height': marker.height,
        'label': label,
        'color': this.colors[parseInt(markerDate.format('M'), 10) - 1],
        'date': date,
        'line': marker.line
      });

      this.render();
    }

    this.lastMarkerDate = markerDate.valueOf();
  },

  remove: function () {
    PubSub.off(Events.ADD_MARKER);
    Backbone.View.prototype.remove.apply(this, arguments);
  }

});
