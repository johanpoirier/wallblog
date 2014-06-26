Wallblog.GridView = Ember.View.extend({

    tagName: 'div',
    classNames: ['wrapper'],
    templateName: 'grid',
    renderTimerHandler: null,

    settings: {
        initNbColumns: 3,
        minColumnWidth: 300
    },

    init: function () {
        this._super();

        $(window).on('resize', _.bind(this.screenResize, this));
    },

    willDestroy: function () {
        $(window).off('resize', _.bind(this.screenResize, this));
    },

    /**
     * New items : re render the grid
     */
    itemsDidChange: function () {
        Ember.run.once(this, function () {
            this.nbColumns = this.computeNbColumns();
            this.submitRender();
        });
    }.observes('controller.items'),

    screenResize: function () {
        var nbColumns = this.computeNbColumns();
        if(nbColumns !== this.nbColumns) {
            this.nbColumns = this.computeNbColumns();
            this.submitRender();
        }
    },

    submitRender: function () {
        if (this.renderTimerHandler) {
            clearTimeout(this.renderTimerHandler);
        }
        this.renderTimerHandler = setTimeout(_.bind(this.preRender, this), 300);
    },

    preRender: function () {
        this.computeColumns();
        this.rerender();
    },

    columns: [],
    columnHeights: [],
    nbColumns: 0,

    computeNbColumns: function() {
        var nbColumns = this.settings.initNbColumns;
        while ((Math.round($(window).width() / nbColumns) < this.settings.minColumnWidth) && (nbColumns > 1)) {
            nbColumns--;
        }
        return nbColumns;
    },

    computeColumns: function () {
        var cols = [];

        // save columns heights
        this.columnHeights = [];
        for (var i = 0; i < this.nbColumns; i++) {
            this.columnHeights[i] = {
                id: i + 1,
                value: 0
            };
        }

        // columns definition
        var columnClass = "column-s" + new String(Math.round(12 / this.nbColumns));
        for (var i = 1; i <= this.nbColumns; i++) {
            cols.push({
                'id': i,
                'class': columnClass,
                'items': []
            });
        }

        // equally distribute items
        var items = this.get('controller').get('items');
        items.forEach((function (item) {
            var shorterColumnId = this.getShorterColumnId();
            cols[shorterColumnId - 1]["items"].push(item);
            this.columnHeights[shorterColumnId - 1].value += parseFloat(item.get("reverseRatio"));
        }).bind(this));

        this.set('columns', cols);

        return true;
    },

    getShorterColumnId: function () {
        return _.reduceRight(this.get('columnHeights'),function (a, b) {
            return (a.value < b.value) ? a : b;
        }).id;
    }
});