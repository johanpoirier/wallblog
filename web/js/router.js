define(['backbone',
        'keymaster',
        'models/picture',
        'collections/pictures',
        'views/grid',
        'views/picture-zoom',
        'backbone-queryparams'],

function(Backbone, key, Picture, PictureCollection, Grid, PictureZoomView) {

    var AppRouter = Backbone.Router.extend({

        initialize: function() {
            Backbone.history.start({ pushState: true, root: "/" });
        },

        routes: {
            '': 'main',
            'login': 'login',
            'item/:id': 'zoom'
        },

        main: function() {
            // get items for the first load
            if(!window.items) {
                window.items = new PictureCollection();
            }
            else {
                window.headerView.render(window.items.length);
            }

            // display items on the grid
            var grid = new Grid({ root: "#main", collection: window.items });

            // admin shortcut
            key('ctrl+alt+l', function() {
               //Backbone.history.navigate('/login', true);
               console.log("Admin login");
               grid.activateDropFile();
            });
        },

        /*login: function() {
            console.log("Admin login");
        },*/

        zoom: function(id) {
           var picture = new Picture({id: id});
           new PictureZoomView({ root: "#main", model: picture, availableWidth: $(window).width(), availableHeight: $(window).height() - 50});
        }
    });

    return AppRouter;
});