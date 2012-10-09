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
        
        settings: {
            initNbColumns: 3,
            minColumnWidth: 200
        },
        
        initialize: function() {
            // listen to window resize event
            this.screenWidth = $(window).width();
            $(window).resize(_.bind(this.screenResize, this));
            
            // fetch items
            this.collection.on("reset", this.render, this);
            this.collection.on("reset", this.sendEvent, this);
            if(this.collection.length === 0) {
                this.collection.fetch({ data: { start: 0, nb: 12 }});
            }
            else {
                this.render();
            }
        },
        
        render: function() {
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
            console.log("Rendering " + this.collection.length + " items on " + this.nbColumns + " columns.");

            // render of items
            this.collection.each(this.renderModel, this);
        },

        renderModel: function(model) {
            var shorterColumId = this.getShorterColumnId();
            var view = new PictureView({ root: this.$("#column" + shorterColumId), model: model });
            this.columnsSize[shorterColumId - 1].value += parseInt(model.get("height")) / parseInt(model.get("width"));
            
            view.render();
        },
        
        getShorterColumnId: function() {
            return this.columnsSize.reduceRight(function(a, b) {
                return (a.value < b.value) ? a : b;
            }).id;
        },

        screenResize: function(event) {
            var currentScreenWidth = $(window).width();
            if(this.screenWidth !== currentScreenWidth) {
                console.log("new screen width : " + currentScreenWidth);
                this.render();
            }
            this.screenWidth = currentScreenWidth;
        },
                
        sendEvent: function() {
            Pubsub.trigger(AppEvents.ITEMS_FETCHED, this.collection.length);
        }
    });
    return Grid;
});