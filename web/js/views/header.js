define(['underscore',
        'jquery',
        'backbone',
        'pubsub',
        'tools',
        'i18n!nls/labels',
        'hbs!templates/header',
        'hbs!templates/header-zoom',
        'hbs!templates/header-edit'],

function(_, $, Backbone, Pubsub, tools, labels, tmpl, tmplZoom, tmplEdit) {

    var HeaderView = Backbone.View.extend({
        template: tmpl,
        labels: labels,
        className: "navbar navbar-fixed-top navbar-inverse",
        
        events: {
            "click img.admin": "login",
            "dblclick .description": "editDescription",
            "keypress input": "submitDescription"
        },
        
        initialize: function() {
            Pubsub.on(AppEvents.ITEMS_ADDED, this.render, this);
            Pubsub.on(AppEvents.ITEM_ZOOMED, this.renderZoom, this);
            Pubsub.on(AppEvents.USER_LOGGED_IN, this.render, this);
            this.nbItems = 0;
            this.admin = false;
        },

        render: function(nbItems) {
            // retrieve total nb of items if we ask for refresh (-1)
            if(nbItems) {
                if(nbItems === -1) {
                    this.requestNbItems();
                }
                else {
                    this.nbItems = nbItems;
                }
            }
            this.template = tmpl;
            HeaderView.__super__.render.apply(this, [{ nbItems: this.nbItems }]);
            
            if(tools.isLogged()) {
                this.$("img.admin").hide();
                this.$("img.upload").show();
            }
            else {
                this.$("img.upload").hide();
                this.$("img.admin").show();
            }
        },
        
        requestNbItems: function() {
            $.get("api/items/count", _.bind(this.render, this));
        },

        renderZoom: function(item) {
            this.template = tmplZoom;
            this.item = item;
            HeaderView.__super__.render.apply(this, [ item.toJSON() ]);
        },

        renderEdit: function() {
            this.template = tmplEdit;
            HeaderView.__super__.render.apply(this, [ this.item.toJSON() ]);
        },
        
        login: function() {
            if(!tools.isLogged()) {
                Backbone.history.navigate('/login', true);
            }
        },
        
        editDescription: function() {
            if(tools.isLogged()) {
                this.renderEdit();
            }
        },
        
        submitDescription: function(e) {
            if(tools.isLogged() && (e.keyCode === 13)) {
                this.$("input[name='description']").val();
                this.item.set("description", this.$("input[name='description']").val());
                this.item.save();
            }
        }
    });
    return HeaderView;
});