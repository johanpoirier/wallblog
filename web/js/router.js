define(['backbone', 'underscore', 'views/app'], function(Backbone, _, AppView) {
    var AppRouter = Backbone.Router.extend({
        
        initialize : function() {
            _.bindAll(this, 'home', 'showItem');
        },
        
        routes: {
            '' : 'home',
            'item/{id}' : 'showItem'
        },
        
        home: function() {
            console.log("show home");
            if (!this.appView) {
                this.appView = new AppView({
                    root: "#wallblog"
                });
            }
            this.appView.render();
        },

        showItem: function(id) {
            console.log("show item " + id);
        }
    });
    
    return AppRouter;
});