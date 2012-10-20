define(['underscore',
    'backbone',
    'jquery',
    'pubsub',
    'tools',
    'views/picture',
    'views/upload',
    'hbs!templates/grid',
    'resthub-handlebars'],

    function(_, Backbone, $, Pubsub, tools, PictureView, UploadView, gridTmpl) {

        var Grid = Backbone.View.extend({
            template: gridTmpl,
            className: "row-fluid",
            strategy: "replace",
        
            currentNbItems: 12,
            loading: false,
            loadingIncrement: 6,
        
            settings: {
                initNbColumns: 3,
                minColumnWidth: 160
            },

            initialize: function() {
                // listen to window resize event
                this.screenWidth = $(window).width();
                $(window).resize(_.bind(this.screenResize, this));
            
                // scroll event
                $(window).scroll(_.bind(this.loadMore, this));
                //$(window).mousewheel(_.bind(this.loadMore, this));

                // fetch items
                Pubsub.on(AppEvents.ITEMS_UPLOADED, this.fetchCurrent, this);
                this.collection.on("add", this.render, this);
                this.collection.on("reset", this.render, this);
                if(this.collection.length === 0) {
                    this.loading = true;
                    this.fetchCurrent();
                }
                else {
                    this.render();
                }
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

                // render of items
                this.collection.each(this.renderModel, this);
            },

            renderModel: function(model) {
                var shorterColumId = this.getShorterColumnId();
                var view = new PictureView({
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
                if(!this.loading && ((window.pageYOffset - this.lastYOffset) > 0) && (($(window).scrollTop() - ($(document).height() - $(window).height())) <= 0)) {
                    //console.log("Loading more items");
                    this.loading = true;
                    this.collection.fetch({
                        add: true, 
                        data: {
                            start: this.currentNbItems, 
                            nb: this.loadingIncrement, 
                            comments: true
                        }
                    });
                this.currentNbItems += this.loadingIncrement;
            }
            this.lastYOffset = window.pageYOffset;
        },
        
        activateDropFile: function() {
            var dropZone = window.document.getElementById("main");
            if(window.FileReader) {
                dropZone.addEventListener("dragover", _.bind(this.handleDragOver, this), false);
                dropZone.addEventListener("drop", _.bind(this.handleFileSelect, this), false);
            }
        /*else {
                alert("Your browser does not support HTML5 file uploads!");
            }*/
        },

        handleFileSelect: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            
            if(tools.isLogged()) {
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
                    alert("Too many files! Only one allowed!");
                }
            }
            else {
                alert("You must be logged in to upload pictures.");
                Backbone.history.navigate('/login', true);
            }
        },

        handleDragOver: function(evt) {
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
            this.collection.fetch({
                data: {
                    start: 0, 
                    nb: this.currentNbItems, 
                    comments: true
                }
            });
        Pubsub.trigger(AppEvents.ITEMS_ADDED, -1);
        }
    });
return Grid;
});