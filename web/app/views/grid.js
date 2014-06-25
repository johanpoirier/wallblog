Wallblog.GridView = Ember.View.extend({
    init: function() {
        this._super();
        this.width = $(window).width();

        /*var view = this;
        var resizeHandler = function() {
            view.rerender();
        };
        this.set('resizeHandler', resizeHandler);

        $(window).bind('resize', this.get('resizeHandler'));*/
    },

    /*willDestroy: function() {
        $(window).unbind('resize', this.get('resizeHandler'));
    },*/

    tagName: 'div',
    classNames: ['row'],
    templateName: 'grid',

    itemsDidChange: function() {
        console.debug("items did change");
        this.computeColumns();
        this.rerender();
    }.observes('controller.items'),

    columns: [],
    columnHeights: [],
    computeColumns: function() {
        var cols = [];

        // compute number of columns
        var nbColumns = 3;
        while ((Math.round(this.width / nbColumns) < 200) && (nbColumns > 1)) {
            nbColumns--;
        }

        // save columns heights
        var columnHeights = [];
        for (var i = 0; i < nbColumns; i++) {
            this.columnHeights[i] = {
                id: i + 1,
                value: 0
            };
        }

        // columns definition
        var columnClass = "col-md-" + new String(Math.round(12 / nbColumns));
        for(var i = 1; i <= nbColumns; i++) {
            cols.push({
                'id': i,
                'class': columnClass,
                'items': []
            });
        }
        this.set('columns', cols);

        // equally distribute items
        var items = this.get('controller').get('items');
        items.forEach((function(item) {
            var shorterColumnId = this.getShorterColumnId();
            this.get('columns')[shorterColumnId - 1]["items"].push(item);
            this.get('columnHeights')[shorterColumnId - 1].value += parseFloat(item.get("reverseRatio"));
        }).bind(this));

        console.debug("nb columns : " + nbColumns);
        this.set('columns', cols);
    },

    getShorterColumnId: function () {
        return _.reduceRight(this.get('columnHeights'), function (a, b) {
            return (a.value < b.value) ? a : b;
        }).id;
    }
});