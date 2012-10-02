define(['underscore', 'backbone', 'hbs!templates/picture.html'],
    function(_, Backbone, pictureTmpl){
        var PictureView = Backbone.View.extend({

            tagName:  "div",
            className: "zoom",
            template: pictureTmpl,

            events: {
                'click img': 'back'
            },

            initialize: function() {
                _.bindAll(this, 'render', 'back');
      
                // Add this context in order to allow automatic removal of the calback with dispose()
                this.model.on('change', this.refresh, this);
                this.model.on('destroy', this.remove, this);
                this.render(this.model.toJSON());
            },

            refresh: function() {
                this.render();
            },
            
            back: function() {
                app.navigate('', true);
            }
        });
        return PictureView;
    });
