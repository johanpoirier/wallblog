define(['underscore', 'backbone'], function(_, Backbone) {
    var ItemModel = Backbone.Model.extend({

        defaults: {
            description: 'no description',
            file: 'http://omerveilles.com/images/question-mark.gif'
        },
    
        urlRoot: '/api/item',

        initialize: function() {
            if (!this.get('description')) {
                this.set({
                    'description': this.defaults.description
                    });
            }
        },

        clear: function() {
            this.destroy();
        }
    });
    return ItemModel;
});