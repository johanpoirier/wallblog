define(['jquery',
    'backbone',
    'keymaster',
    'tools',
    'models/item',
    'collections/items',
    'views/grid',
    'views/item-zoom',
    'views/user-form',
    'backbone-queryparams'],

  function ($, Backbone, key, tools, Item, ItemCollection, Grid, ItemZoomView, UserFormView) {

    var AppRouter = Backbone.Router.extend({

      initialize: function () {
        Backbone.history.start({ pushState: true, root: "/" });

        Pubsub.on(AppEvents.FILTER, this.saveFilter, this);
        Pubsub.on(AppEvents.CLEAR_FILTER, this.clearFilter, this);
      },

      routes: {
        'login': 'login',
        'new-user': 'newUser',
        'item/:id': 'zoom',
        '': 'main'
      },

      main: function () {
        // render header bar even if nb items is unknown
        window.headerView.render();

        // list of all ids
        window.zoomCurrentIndex = 0;

        // get items for the first load
        if (!window.items) {
          window.items = new ItemCollection();
          window.items.on('remove', this.main, this);
        }

        // display items on the grid
        var grid = new Grid({ root: "#main", collection: window.items, filter: this.filter });

        // admin shortcut
        if (!tools.isLogged()) {
          key('ctrl+alt+l', function () {
            Backbone.history.navigate('/login', true);
          });
        }

        grid.listenToScroll();

        // get list of all ids if not yet
        if (!window.itemIds) {
          window.zoomCurrentIndex = 0;
          this.getListOfIds();
        }
      },

      getListOfIds: function () {
        $.get("/api/items/ids", function (data) {
          window.itemIds = data;
        });
      },

      login: function () {
        this.main();
        window.headerView.showLogin();
      },

      newUser: function () {
        new UserFormView();
      },

      zoom: function (id) {
        if (!window.itemIds) {
          window.zoomCurrentIndex = 0;
          $.get("/api/items/ids", _.bind(function (data) {
            window.itemIds = data;
            this.zoomDisplay(id);
          }, this));
        }
        else {
          this.zoomDisplay(id);
        }
      },

      zoomDisplay: function (data) {
        var id = data;
        if (data.id) {
          id = data.id;
        }
        var item = new Item({ id: id });
        var win = $(window);
        new ItemZoomView({
          root: "#main",
          model: item,
          availableWidth: win.width(),
          availableHeight: win.height() - 44
        });
      },

      saveFilter: function (monthId, year) {
        this.filter = {
          "year": year,
          "monthId": monthId
        };
      },

      clearFilter: function () {
        this.filter = null;
      }
    });

    return AppRouter;
  });