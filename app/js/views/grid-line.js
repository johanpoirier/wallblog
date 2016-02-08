import _ from 'underscore';
import Backbone from 'backbone';
import PubSub from 'utils/pubsub';
import tools from 'utils/tools';
import Events from 'utils/events';
import Settings from 'utils/settings';
import LineView from 'views/line';
import UploadView from 'views/upload';

export default Backbone.View.extend({
  className: "grid line",
  tagName: "section",

  loading: false,
  loadingIncrement: 12,
  currentNbItems: 24,
  maxItemsToUpload: 12,

  currentLine: null,
  lastItemId: false,

  events: {
    dragover: "handleDragOver",
    drop: "handleFileSelect"
  },

  initialize: function (options) {
    // fetch items
    Pubsub.on(Events.ITEMS_UPLOADED, this.fetchCurrent, this);
    this.collection.on("add", this.addItemToLine, this);
    this.collection.on("reset", this.render, this);
    this.collection.on("remove", this.onRemove, this);
    if (this.collection.length === 0) {
      this.loading = true;
      this.fetchCurrent();
    }
    else {
      this.currentNbItems = this.collection.length;
      this.render();
    }

    // on resize, re-compute lines
    $(window).on('resize', _.debounce(this.screenResize.bind(this), 100));

    // listen to filter
    if (options.filter) {
      this.filterActive = true;
      this.filterValue = options.filter.year + "-" + options.filter.month;
    }
    Pubsub.on(Events.FILTER, this.filterItems, this);
    Pubsub.on(Events.CLEAR_FILTER, this.fetchCurrent, this);
  },

  onDispose: function () {
    $(window).unbind('resize');
    $(window).unbind('scroll');
  },

  computeLineDimensions: function () {
    this.screenWidth = $(window).innerWidth();
    this.screenHeight = $(window).height();
    this.lineBaseHeight = Math.floor(this.screenHeight / 3);
    this.lineMaxWidth = (this.screenWidth * 0.98) / this.lineBaseHeight;
  },

  render: function () {
    this.loading = false;

    // first line
    this.$el.empty();
    this.computeLineDimensions();
    this.newLine();

    // first time on the site ?
    if (this.collection.length === 0) {
      // Display one default image per column
      for (var i = 0; i < 18; i++) {
        this.collection.add({
          file: "empty.jpg",
          date: "2011-10-17 18:56:10",
          ratio: 1,
          reverseRatio: 1
        }, { silent: true });
      }

      // Check if no user in db
      $.get("/api/users/count", function (nbUsers) {
        if (parseInt(nbUsers) === 0) {
          // Display new user form
          Backbone.history.navigate('/new-user', true);
        }
      });
    }

    // render of items
    this.collection.each(this.addItemToLine, this);
    if (!this.currentLine.isRendered()) {
      this.currentLine.renderLine();
    }

    // set last scroll position
    if (window.currentScollPosition) {
      $(document).scrollTop(window.currentScollPosition);
    }
  },

  addItemToLine: function (item) {
    if (!this.currentLine.addItem(item)) {
      this.newLine().addItem(item);
    }
    if (this.checkIfLastItem(item)) {
      this.currentLine.renderLine();
    }
  },

  checkIfLastItem: function (item) {
    return item.get('id') === this.collection.last().get('id');
  },

  newLine: function () {
    this.currentLine = new LineView({
      'el': this.$el,
      'maxWidth': this.lineMaxWidth,
      'baseHeight': this.lineBaseHeight
    });
    return this.currentLine;
  },

  screenResize: function () {
    var currentScreenWidth = $(window).innerWidth();
    var currentScreenHeight = $(window).height();

    var reRender = (this.screenWidth !== currentScreenWidth) || (this.screenHeight !== currentScreenHeight);

    this.screenWidth = currentScreenWidth;
    this.screenHeight = currentScreenHeight;

    if (reRender) {
      this.render();
    }
  },

  listenToScroll: function () {
    $(window).on('scroll', _.throttle(this.loadMore.bind(this), 300));
  },

  loadMore: function () {
    if (!this.filterActive && !this.loading && ((window.innerHeight + window.pageYOffset) > 0.5 * this.$el.height())) {
      this.loading = true;
      this.collection.fetch({
        'add': true,
        'remove': false,
        'data': {
          'start': this.currentNbItems,
          'nb': this.loadingIncrement,
          'comments': true
        },
        'success': function (items) {
          this.loading = false;
          this.currentNbItems = items.length;
        }.bind(this)
      });
    }
  },

  handleFileSelect: function (e) {
    var evt = e.originalEvent;
    evt.stopPropagation();
    evt.preventDefault();

    if (tools.isLogged()) {
      if (window.FileReader) {
        var files = evt.dataTransfer.files;
        if (files.length <= this.maxItemsToUpload) {
          this.uploadPictures = [];
          this.uploadFiles(files, 0);
        }
        else {
          alert("Too many files! Only " + this.maxItemsToUpload + " allowed!");
        }
      }
      else {
        alert("Your browser does not support HTML5 file uploads!");
      }
    }
    else {
      alert("You must be logged in to upload pictures.");
      Backbone.history.navigate('/login', true);
    }
  },

  handleDragOver: function (e) {
    var evt = e.originalEvent;
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  uploadFiles: function (files, index) {
    if (index >= files.length) {
      var uploadView = new UploadView();
      $('body').append(uploadView.render(this.uploadPictures).el);
      return;
    }

    var file = files[index];
    index += 1;

    if (!file.type.match("image.*")) {
      alert("Only images are allowed!");
      this.uploadFiles(files, index);
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      this.uploadPictures.push({
        data: e.target.result,
        filename: file.name,
        id: (this.uploadPictures.length + 1)
      });
      this.uploadFiles(files, index);
    }.bind(this);
    reader.readAsDataURL(file);
  },

  fetchCurrent: function () {
    var filter = this.getFilterValue();
    this.collection.fetch({
      'data': {
        'filter': filter,
        'start': 0,
        'nb': this.currentNbItems,
        'comments': true
      },
      'reset': true
    });
    Pubsub.trigger(Events.ITEMS_ADDED, -1);
  },

  getFilterValue: function () {
    var filterValue = null;
    var filter = Settings.getFilter();
    if (filter.year) {
      filterValue = filter.year;
      if (filter.monthId) {
        filterValue += '-' + filter.monthId;
      }
      this.filterActive = true;
    } else {
      this.filterActive = false;
    }
    return filterValue;
  },

  filterItems: function () {
    this.collection.fetch({
      'data': {
        'filter': this.getFilterValue(),
        'comments': true
      },
      'reset': true
    });
  },

  onRemove: function () {
    Backbone.history.navigate('/', false);
    this.render();
  }
});
