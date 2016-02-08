import _ from 'underscore';
import Backbone from 'backbone';

var Pubsub = window.Pubsub;

if (!Pubsub) {
    Pubsub = {};
    _.extend(Pubsub, Backbone.Events);
}

window.Pubsub = Pubsub;

export default Pubsub;
