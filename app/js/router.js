import Backbone from 'backbone';
import key from 'keymaster';
import tools from 'utils/tools';
import Settings from 'utils/settings';
import Events from 'utils/events';
import Constants from 'utils/constants';
import Item from 'models/item';
import ItemCollection from 'collections/items';
import GridLine from 'views/grid-line';
import GridColumn from 'views/grid-column';
import ItemZoomView from 'views/item-zoom';
import UserFormView from 'views/user-form';
import HeaderView from 'views/header';
import MenuView from 'views/menu';
import TimelineView from 'views/timeline';

export default Backbone.Router.extend({

  initialize: function () {
    this.displayMode = Settings.getDisplayMode();

    this.items = null;
    this.itemIds = null;

    this.headerView = new HeaderView($('header'));
    this.menuView = new MenuView({ 'el': $('nav') });

    Pubsub.on(Events.FILTER, this.saveFilter, this);
    Pubsub.on(Events.CLEAR_FILTER, this.clearFilter, this);

    Backbone.history.start({ 'pushState': true, 'root': '/' });
  },

  routes: {
    'login': 'login',
    'new-user': 'newUser',
    'item/:id': 'zoom',
    '': 'main'
  },

  main: function () {
    // zoom view clean
    if (this.zoomView) {
      this.zoomView.remove();
      this.zoomView = null;
    }

    // get items for the first load
    if (!this.items) {
      this.items = new ItemCollection();
      this.items.on('remove', this.main, this);
    } else {
      // reset rendered status
      this.items.resetRender();
    }

    // render header bar even if nb items is unknown
    this.headerView.setItems(this.items);
    this.headerView.render();

    // timeline
    this.timelineView = new TimelineView();
    $('main').html(this.timelineView.el);

    // display items on the grid
    var grid, dataGrid = { collection: this.items, filter: this.filter };
    if (this.displayMode == Constants.DISPLAY_MODE_LINE) {
      grid = new GridLine(dataGrid);
    } else {
      grid = new GridColumn(dataGrid);
    }
    $('main').append(grid.el);
    grid.render();
    grid.listenToScroll();

    // line / row
    key('ctrl+alt+d', this.changeDisplayMode.bind(this));

    // admin shortcut
    if (!tools.isLogged()) {
      key('ctrl+alt+l', function () {
        Backbone.history.navigate('/login', true);
      });
    }
  },

  changeDisplayMode: function () {
    Settings.saveDisplayMode((this.displayMode == Constants.DISPLAY_MODE_LINE) ? Constants.DISPLAY_MODE_ROW : Constants.DISPLAY_MODE_LINE);
    window.location.reload(true);
  },

  login: function () {
    this.main();
    this.headerView.showLogin();
  },

  newUser: function () {
    new UserFormView();
  },

  getItemIds: function (callback) {
    // filter -> get only items filtered ids
    if (Settings.isFilterActive()) {
      callback(this.items.models.map(function (item) {
        return item.get('id');
      }));
      return;
    }

    // get all item ids (and fetch it if needed)
    if (!this.itemIds) {
      $.get('/api/items/ids', function (ids) {
        this.itemIds = ids;
        callback(ids);
      }.bind(this));
    } else {
      callback(this.itemIds);
    }
  },

  zoom: function (id) {
    if (this.timelineView) {
      this.timelineView.remove();
      this.timelineView = null;
    }

    var item;
    if (!this.items) {
      this.items = new ItemCollection();
      item = new Item({ 'id': id });
    } else {
      item = this.items.get(id);
    }
    this.headerView.setItems(this.items);

    this.getItemIds(function (data) {
      this.zoomDisplay(item, data);
    }.bind(this));
  },

  zoomDisplay: function (item, itemIds) {
    var win = $(window);
    this.zoomView = new ItemZoomView({
      'root': $('main'),
      'model': item,
      'itemIds': itemIds,
      'availableWidth': win.width(),
      'availableHeight': win.height() - 44
    });
  }
});
