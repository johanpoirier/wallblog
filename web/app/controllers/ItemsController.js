Wallblog.ItemsController = Ember.ArrayController.extend({

    needs: ['application'],

    title: 'Wallblog',
    nbItems: 0,
    itemController: 'item'
});