Wallblog.Router.map(function() {
    this.resource('items', { path: '/' });
});

Wallblog.ItemsRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('item');
    }
});