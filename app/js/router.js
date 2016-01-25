define(['jquery',
    'backbone',
    'keymaster',
    'tools',
    'models/item',
    'collections/items',
    'views/grid-line',
    'views/grid-row',
    'views/item-zoom',
    'views/user-form',
    'backbone-queryparams'],

  function ($, Backbone, key, tools, Item, ItemCollection, GridLine, GridRow, ItemZoomView, UserFormView) {

    var AppRouter = Backbone.Router.extend({

      initialize: function () {
        this.displayMode = Constants.DISPLAY_MODE_LINE;

        Pubsub.on(AppEvents.FILTER, this.saveFilter, this);
        Pubsub.on(AppEvents.CLEAR_FILTER, this.clearFilter, this);

        Backbone.history.start({ pushState: true, root: "/" });
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
        var grid, dataGrid = { root: "main", collection: window.items, filter: this.filter };
        if (this.displayMode == Constants.DISPLAY_MODE_LINE) {
          grid = new GridLine(dataGrid);
        } else {
          grid = new GridRow(dataGrid);
        }
        grid.listenToScroll();

        // admin shortcut
        if (!tools.isLogged()) {
          key('ctrl+alt+l', function () {
            Backbone.history.navigate('/login', true);
          });
        }

        // line / row
        //key('ctrl+alt+d', this.changeDisplayMode.bind(this));

        // get list of all ids if not yet
        if (!window.itemIds) {
          window.zoomCurrentIndex = 0;
          this.getListOfIds();
        }
      },

      /*changeDisplayMode: function () {
        this.displayMode = (this.displayMode == Constants.DISPLAY_MODE_LINE) ? Constants.DISPLAY_MODE_ROW : Constants.DISPLAY_MODE_LINE;
        window.items = null;
        this.main();
      },*/

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
        var item;
        if (!window.items) {
          window.items = new ItemCollection();
          item = new Item({ 'id': id });
        } else {
          item = window.items.get(id);
        }

        if (!window.itemIds) {
          window.zoomCurrentIndex = 0;
          $.get("/api/items/ids", function (data) {
            window.itemIds = data;
            this.zoomDisplay(item);
          }.bind(this));
        }
        else {
          this.zoomDisplay(item);
        }
      },

      zoomDisplay: function (item) {
        var win = $(window);
        new ItemZoomView({
          root: "main",
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