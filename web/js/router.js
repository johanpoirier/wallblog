define(['backbone', 'underscore', 'models/item', 'views/app', 'views/picture'], function(Backbone, _, ItemModel, AppView, PictureView) {
    var AppRouter = Backbone.Router.extend({
        
        initialize : function() {
            _.bindAll(this, 'home', 'showItem');
        },
        
        routes: {
            '' : 'home',
            'item/:id' : 'showItem'
        },
        
        home: function() {
            new AppView({
                root: "#content"
            });
        },

        showItem: function(id) {
            var picture = new ItemModel();
            picture.set({ id: id });
            picture.fetch({
                success: function() {
                    new PictureView({ root: '#content', model: picture });
                }
            });
        }
    });
    
    return AppRouter;
});