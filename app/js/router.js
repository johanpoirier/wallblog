import Backbone from 'backbone';
import key from 'keymaster';
import tools from 'tools';
import Item from 'models/item';
import ItemCollection from 'collections/items';
import GridLine from 'views/grid-line';
import GridRow from 'views/grid-row';
import ItemZoomView from 'views/item-zoom';
import UserFormView from 'views/user-form';

export default Backbone.Router.extend({

  initialize: function () {
    this.displayMode = window.localStorage.getItem(Constants.DISPLAY_MODE_LABEL) || Constants.DISPLAY_MODE_LINE;

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
    $('header').html(window.headerView.el);

    // list of all ids
    window.zoomCurrentIndex = 0;

    // get items for the first load
    if (!window.items) {
      window.items = new ItemCollection();
      window.items.on('remove', this.main, this);
    }

    // display items on the grid
    var grid, dataGrid = { collection: window.items, filter: this.filter };
    if (this.displayMode == Constants.DISPLAY_MODE_LINE) {
      grid = new GridLine(dataGrid);
    } else {
      grid = new GridRow(dataGrid);
    }
    grid.listenToScroll();
    $('#main').html(grid.el);

    // line / row
    key('ctrl+alt+d', this.changeDisplayMode.bind(this));

    // admin shortcut
    if (!tools.isLogged()) {
      key('ctrl+alt+l', function () {
        Backbone.history.navigate('/login', true);
      });
    }

    // get list of all ids if not yet
    if (!window.itemIds) {
      window.zoomCurrentIndex = 0;
      this.getListOfIds();
    }
  },

  changeDisplayMode: function () {
    window.localStorage.setItem(Constants.DISPLAY_MODE_LABEL, (this.displayMode == Constants.DISPLAY_MODE_LINE) ? Constants.DISPLAY_MODE_ROW : Constants.DISPLAY_MODE_LINE);
    window.location.reload(true);
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
    var view = new ItemZoomView({
      model: item,
      availableWidth: win.width(),
      availableHeight: win.height() - 44
    });
    $('#main').html(view.el);
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
