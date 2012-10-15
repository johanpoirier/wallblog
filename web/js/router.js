define(['jquery',
        'backbone',
        'keymaster',
        'tools',
        'models/picture',
        'collections/pictures',
        'views/grid',
        'views/picture-zoom',
        'views/login',
        'backbone-queryparams'],

function($, Backbone, key, tools, Picture, PictureCollection, Grid, PictureZoomView, LoginView) {

    var AppRouter = Backbone.Router.extend({

        initialize: function() {
            Backbone.history.start({ pushState: true, root: "/" });
        },

        routes: {
            'login': 'login',
            'item/:id': 'zoom',
            '': 'main'
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
            grid.activateDropFile();

            // admin shortcut
            if(!tools.isLogged()) {
                key('ctrl+alt+l', function() {
                    Backbone.history.navigate('/login', true);
                });
            }
            
            // set last scroll position
            if(window.currentScollPosition) {
                $(document).scrollTop(window.currentScollPosition);
            }
        },

        login: function() {
            new LoginView({
                root: $("body")
            });
        },

        zoom: function(id) {
           var picture = new Picture({id: id});
           new PictureZoomView({ root: "#main", model: picture, availableWidth: $(window).width(), availableHeight: $(window).height() - 50});
        }
    });

    return AppRouter;
});