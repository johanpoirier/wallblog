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
                this.collection.fetch();
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
            
            // render of columns
            var columnClass = "span" + new String(Math.round(12 / this.nbColumns));
            Grid.__super__.render.apply(this, [{ nbColumns: this.nbColumns, columnClass: columnClass }]);
            console.log("Rendering " + this.collection.length + " items on " + this.nbColumns + " columns.");

            // render of items
            this.indexColumn = 1;
            this.collection.each(this.renderModel, this);
        },

        renderModel: function(model) {
            var view = new PictureView({ root: this.$("#column" + this.indexColumn++), model: model });
            view.render();
            if(this.indexColumn > this.nbColumns) {
                this.indexColumn = 1;
            }
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
            Pubsub.trigger(App.Events.ITEMS_FETCHED, this.collection.length);
        }
    });
    return Grid;
});