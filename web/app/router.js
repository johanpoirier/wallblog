Wallblog.Router.map(function() {
    this.resource('items', { path: '/' });
    this.resource('item', { path: 'item/:item_id'});
});

Wallblog.ItemsRoute = Ember.Route.extend({
    setupController: function(controller) {
        controller.set('title', "Tan, Johan & Evan");
        controller.set('items', this.store.find('item', {
            limit: 12,
            offset: 0
        }));
    }
});