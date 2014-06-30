Wallblog.Router.map(function() {
    this.resource('items', { path: '/' });
    this.resource('item', { path: 'item/:item_id'});
});

Wallblog.ApplicationRoute = Ember.Route.extend({
    actions: {
        openModal: function(modalName) {
            return this.render(modalName, {
                into: 'application',
                outlet: 'modal'
            });
        },
        closeModal: function() {
            return this.disconnectOutlet({
                outlet: 'modal',
                parentView: 'application'
            });
        }
    }
});

Wallblog.ItemsRoute = Ember.Route.extend({
    setupController: function(controller) {
        controller.set('title', "Tan, Johan & Evan");
        this.store.find('item', {
            limit: 9,
            offset: 0,
            comments: true
        }).then(function(items) {
            controller.set('items', items);
            controller.set('nbItems', items.meta['total']);
        });
    }
});

Wallblog.ItemRoute = Ember.Route.extend({
    actions: {
        delete: function() {
            console.debug("transition to items");
            this.transitionTo('items');
        }
    }
});