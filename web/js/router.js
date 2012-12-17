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
            // render header bar even if nb items is unknown
            window.headerView.render();
           
            // get items for the first load
            if(!window.items) {
                window.items = new PictureCollection();
            }

            // display items on the grid
            var grid = new Grid({ root: "#main", collection: window.items });

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
            grid.listenToScroll();
        },

        login: function() {
            new LoginView();
        },

        zoom: function(id) {
           var picture = new Picture({id: id});
           new PictureZoomView({ root: "#main", model: picture, availableWidth: $(window).width(), availableHeight: $(window).height() - 50});
        }
    });

    return AppRouter;
});