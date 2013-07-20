define(['underscore',
    'backbone',
    'jquery',
    'pubsub',
    'tools',
    'views/item',
    'views/upload',
    'hbs!templates/grid',
    'resthub-handlebars'],

function(_, Backbone, $, Pubsub, tools, ItemView, UploadView, gridTmpl) {

    var Grid = Backbone.View.extend({
        template: gridTmpl,
        className: "row-fluid",
        strategy: "replace",

        loading: false,
        loadingIncrement: 6,
        currentNbItems: 15,

        settings: {
            initNbColumns: 3,
            minColumnWidth: 160
        },

        events: {
            dragover: "handleDragOver",
            drop: "handleFileSelect",
            "click .item": "zoom"
        },

        initialize: function() {
            // listen to window resize event
            this.screenWidth = $(window).width();
            $(window).resize(_.bind(this.screenResize, this));

            // fetch items
            Pubsub.on(AppEvents.ITEMS_UPLOADED, this.fetchCurrent, this);
            this.collection.on("add", this.renderModel, this);
            this.collection.on("reset", this.render, this);
            this.collection.on("remove", this.render, this);
            if(this.collection.length === 0) {
                this.loading = true;
                this.fetchCurrent();
            }
            else {
                this.currentNbItems = this.collection.length;
                this.render();
            }

            // listen to filter
            Pubsub.on(AppEvents.FILTER, this.filterItems, this);
        },

        onDispose: function() {
            $(window).unbind("resize");
            $(window).unbind("scroll");
        },

        render: function() {
            this.loading = false;
            this.lastYOffset = window.pageYOffset;

            // compute number of columns
            this.nbColumns = this.settings.initNbColumns;
            while((Math.round(this.screenWidth / this.nbColumns) < this.settings.minColumnWidth) && (this.nbColumns > 1)) {
                this.nbColumns--;
            }

            // save columns heights
            this.columnsSize = [];
            for(var i=0; i<this.nbColumns; i++) {
                this.columnsSize[i] = {
                    id: i+1,
                    value: 0
                };
            }

            // render of columns
            var columnClass = "span" + new String(Math.round(12 / this.nbColumns));
            Grid.__super__.render.apply(this, [{
                nbColumns: this.nbColumns,
                columnClass: columnClass
            }]);


            // first time on the site ?
            if(this.collection.length === 0) {
                // Display one default image per column
                for(i=0; i<this.nbColumns; i++) {
                    this.collection.add({
                        file: "empty.jpg",
                        date: "2011-10-17 18:56:10",
                        ratio: 1,
                        reverseRatio: 1
                    }, {
                        silent: true
                    });
                }

                // Check if no user in db
                $.get("/api/users/count", function(nbUsers) {
                    if(parseInt(nbUsers) === 0) {
                        // Display new user form
                        Backbone.history.navigate('/new-user', true);
                    }
                });
            }

            // render of items
            this.collection.each(this.renderModel, this);

            // set last scroll position
            if(window.currentScollPosition) {
                $(document).scrollTop(window.currentScollPosition);
            }
        },

        renderModel: function(model) {
            var shorterColumId = this.getShorterColumnId();
            var view = new ItemView({
                root: this.$("#column" + shorterColumId),
                model: model
            });
            this.columnsSize[shorterColumId - 1].value += parseFloat(model.get("reverseRatio"));

            view.render();
        },

        getShorterColumnId: function() {
            return _.reduceRight(this.columnsSize, function(a, b) {
                return (a.value < b.value) ? a : b;
            }).id;
        },

        screenResize: function() {
            var currentScreenWidth = $(window).width();
            var reRender = (this.screenWidth !== currentScreenWidth);
            this.screenWidth = currentScreenWidth;
            if(reRender) {
                this.render();
            }
        },

        loadMore: function() {
            if(!this.filter && !this.loading && ((window.pageYOffset - this.lastYOffset) > 0) && (($(window).scrollTop() - ($(document).height() - $(window).height())) <= 0)) {
                //console.log("Loading more items");
                this.loading = true;
                this.collection.fetch({
                    add: true,
                    data: {
                        start: this.currentNbItems,
                        nb: this.loadingIncrement,
                        comments: true
                    },
                    success: _.bind(function() {
                        this.loading = false;
                    }, this)
                });
                this.currentNbItems += this.loadingIncrement;
            }
            this.lastYOffset = window.pageYOffset;
        },

        handleFileSelect: function(e) {
            var evt = e.originalEvent;
            evt.stopPropagation();
            evt.preventDefault();

            if(tools.isLogged()) {
                if(window.FileReader) {
                    var files = evt.dataTransfer.files;
                    if(files.length <= 6) {
                        this.uploadPictures = [];
                        for(var i=0; i<files.length; i++) {
                            var file = files[i];

                            if (!file.type.match("image.*")) {
                                alert("Only images are allowed!");
                                break;
                            }

                            var reader = new FileReader();
                            reader.onload = this.handleFileUpload(file, (i === (files.length - 1)));
                            reader.readAsDataURL(file);
                        }
                    }
                    else {
                        alert("Too many files! Only 6 allowed!");
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

        handleDragOver: function(e) {
            var evt = e.originalEvent;
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy';
        },

        handleFileUpload: function(file, end) {
            return _.bind(function(e) {
                this.uploadPictures.push({
                    data: e.target.result,
                    filename: file.name,
                    id: (this.uploadPictures.length + 1)
                });

                // last item, display interface
                if(end) {
                    new UploadView({
                        pictures: this.uploadPictures
                    });
                }
            }, this);
        },

        fetchCurrent: function() {
            this.filter = false;
            this.collection.fetch({
                data: {
                    start: 0,
                    nb: this.currentNbItems,
                    comments: true
                }
            });
            Pubsub.trigger(AppEvents.ITEMS_ADDED, -1);
        },

        listenToScroll: function() {
            $(window).scroll(_.bind(this.loadMore, this));
        },

        zoom: function(e) {
            var item = this.$(e.currentTarget);
            window.currentScollPosition = $(document).scrollTop();
            Backbone.history.navigate("/item/" + item.find("img").attr("id"), true);

            return false;
        },

        filterItems: function(month, year) {
            this.filter = true;
            var filterValue = year;
            if(month) {
                filterValue += "-" + month;
            }
            this.collection.fetch({
                data: {
                    filter: filterValue,
                    comments: true
                }
            });
        }
    });
    return Grid;
});