define(['jquery',
        'backbone',
        'keymaster',
        'tools',
        'models/item',
        'collections/items',
        'views/grid',
        'views/item-zoom',
        'views/login',
        'views/user-form',
        'backbone-queryparams'],

function($, Backbone, key, tools, Item, ItemCollection, Grid, ItemZoomView, LoginView, UserFormView) {

    var AppRouter = Backbone.Router.extend({

        initialize: function() {
            Backbone.history.start({ pushState: true, root: "/" });
        },

        routes: {
            'login': 'login',
            'new-user': 'newUser',
            'item/:id': 'zoom',
            '': 'main'
        },

        main: function() {
            // render header bar even if nb items is unknown
            window.headerView.render();
           
            // get items for the first load
            if(!window.items) {
                window.items = new ItemCollection();
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

        newUser: function() {
            new UserFormView();
        },

        zoom: function(id) {
           var item = new Item({id: id});
           new ItemZoomView({ root: "#main", model: item, availableWidth: $(window).width(), availableHeight: $(window).height() - 50});
        }
    });

    return AppRouter;
});