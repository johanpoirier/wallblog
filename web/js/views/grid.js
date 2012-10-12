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
        models: {},
        
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
                this.collection.fetch({ data: { start: 0, nb: this.currentNbItems }});
            }
            else {
                this.render();
            }
        },

        render: function() {
            this.loading = false;

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
            return this.columnsSize.reduceRight(function(a, b) {
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
            if(!this.loading && (($(window).scrollTop() - ($(document).height() - $(window).height())) <= 0)) {
                //console.log("Loading more items");
                this.loading = true;
                this.collection.fetch({ add: true, data: { start: this.currentNbItems, nb: this.loadingIncrement }});
                this.currentNbItems += this.loadingIncrement;
            }
        }
    });
    return Grid;
});