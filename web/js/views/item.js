define(['jquery',
        'backbone',
        'i18n!nls/labels',
        'views/item-zoom',
        'hbs!templates/picture'],

function($, Backbone, labels, ItemZoomView, pictureTmpl) {
    
    var ItemView = Backbone.View.extend({
        
        template: pictureTmpl,
        labels: labels,
        className: 'item',
        strategy: 'append',

        events: {
            'click': 'zoom'
        },

        initialize: function(options) {
            this.model.set('quality', options.quality);
        },

        zoom: function () {
            window.currentScollPosition = $(document).scrollTop();
            Backbone.history.navigate('/item/' + this.model.get('id'), true);
            return false;
        }
    });
    return ItemView;
});