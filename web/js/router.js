define(['backbone',
        'models/picture',
        'collections/pictures',
        'views/grid',
        'views/picture-zoom',
        'backbone-queryparams'],
    
function(Backbone, Picture, PictureCollection, Grid, PictureZoomView) {

    var AppRouter = Backbone.Router.extend({
        
        initialize: function() {
            Backbone.history.start({ pushState: true, root: "/" });
        },
        
        routes: {
            '': 'main',
            'item/:id': 'zoom'
        },
        
        main: function() {
            // get items for the first load
            if(!window.items) {
                window.items = new PictureCollection();
            }
            else {
                App.Views.headerView.render(window.items.length);
            }
            
            // display items on the grid
            new Grid({ root: "#main", collection: window.items });
        },

        zoom: function(id) {
           var picture = new Picture({id: id});
           new PictureZoomView({ root: "#main", model: picture, availableHeight: $(window).height() - 50});
        }
    });
    
    return AppRouter;
});