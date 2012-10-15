define(['underscore',
        'backbone',
        'jquery',
        'pubsub',
        'views/picture',
        'hbs!templates/grid',
        'resthub-handlebars'],

function(_, Backbone, $, Pubsub, PictureView, gridTmpl) {

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
            this.collection.on("add", this.render, this);
            this.collection.on("add", this.sendEvent, this);
            this.collection.on("reset", this.render, this);
            this.collection.on("reset", this.sendEvent, this);
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
                this.columnsSize[i] = { id: i+1, value: 0};
            }

            // render of columns
            var columnClass = "span" + new String(Math.round(12 / this.nbColumns));
            Grid.__super__.render.apply(this, [{ nbColumns: this.nbColumns, columnClass: columnClass }]);
            //console.log("Rendering " + this.collection.length + " items on " + this.nbColumns + " columns.");

            // render of items
            this.collection.each(this.renderModel, this);
        },

        renderModel: function(model) {
            var shorterColumId = this.getShorterColumnId();
            var view = new PictureView({ root: this.$("#column" + shorterColumId), model: model });
            this.columnsSize[shorterColumId - 1].value += parseFloat(model.get("reverseRatio"));

            view.render();
        },

        getShorterColumnId: function() {
            return _.reduceRight(this.columnsSize, function(a, b) {
                return (a.value < b.value) ? a : b;
            }).id;
        },

        screenResize: function(event) {
            var currentScreenWidth = $(window).width();
            var reRender = (this.screenWidth !== currentScreenWidth);
            this.screenWidth = currentScreenWidth;
            if(reRender) {
                //console.log("new screen width : " + currentScreenWidth);
                this.render();
            }
        },

        sendEvent: function() {
            Pubsub.trigger(AppEvents.ITEMS_FETCHED, this.collection.length);
        },
        
        loadMore: function() {
            if(!this.loading && ((window.pageYOffset - this.lastYOffset) > 0) && (($(window).scrollTop() - ($(document).height() - $(window).height())) <= 0)) {
                //console.log("Loading more items");
                this.loading = true;
                this.collection.fetch({ add: true, data: { start: this.currentNbItems, nb: this.loadingIncrement, comments: true }});
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

            var files = evt.dataTransfer.files;
            if(files.length == 1) {
                // Only process image files.
                if (!files[0].type.match("image.*")) {
                    alert("Only images are allowed!");
                    return;
                }

                var reader = new FileReader();
                reader.onload = this.handleFileUpload(files[0]);
                reader.readAsDataURL(files[0]);
            }
            else {
                alert("Too many files! Only one allowed!");
            }
        },

        handleDragOver: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy';
        },

        handleFileUpload: function(file) {
            return _.bind(function(e) {
                var desc = prompt("Description de la photo ?");
                if(desc && desc.length > 0) {
                    $.ajax({
                        type: "POST",
                        url: "api/item",
                        data: {
                            data: e.target.result,
                            filename: file.name,
                            description: desc
                        },
                        success: _.bind(this.fetchCurrent, this)
                    });
                }
            }, this);
        },
        
        fetchCurrent: function() {
            this.collection.fetch({ data: { start: 0, nb: this.currentNbItems, comments: true }});
        }
    });
    return Grid;
});