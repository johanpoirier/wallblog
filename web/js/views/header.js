define(['underscore',
        'jquery',
        'backbone',
        'pubsub',
        'views/upload-video',
        'views/filter-dates',
        'tools',
        'i18n!nls/labels',
        'hbs!templates/header',
        'hbs!templates/header-zoom',
        'hbs!templates/header-edit'],

function(_, $, Backbone, Pubsub, UploadVideoView, FilterDatesView, tools, labels, tmpl, tmplZoom, tmplEdit) {

    var HeaderView = Backbone.View.extend({
        template: tmpl,
        labels: labels,
        className: 'headbar',
        
        events: {
            "click img.admin": "login",
            "click img.upload": "upload",
            "dblclick .description": "editDescription",
            "keypress input[name='description']": "submitDescription",
            "blur input[name='description']": "escapeDescription",
            "click .delete": "deletePicture"
        },
        
        initialize: function() {
            Pubsub.on(AppEvents.ITEMS_ADDED, this.render, this);
            Pubsub.on(AppEvents.ITEM_ZOOMED, this.renderZoom, this);
            Pubsub.on(AppEvents.USER_LOGGED_IN, this.render, this);
            Pubsub.on(AppEvents.FILTER, this.saveFilter, this);
            Pubsub.on(AppEvents.CLEAR_FILTER, this.clearFilter, this);
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

            // update browser title
            window.document.title = WallBlog.title;
            if(this.nbItems > 0) {
                window.document.title += " - " + this.nbItems + " photos";
            }

            // render header bar
            this.template = tmpl;
            HeaderView.__super__.render.apply(this, [{ nbItems: this.nbItems, title: WallBlog.title }]);

            if(tools.isLogged()) {
                this.$("img.admin").hide();
                this.$("img.upload").show();
            }
            else {
                this.$("img.upload").hide();
                this.$("img.admin").show();
            }

            new FilterDatesView({ el: this.$(".filter"), filter: this.filter });
        },
        
        requestNbItems: function() {
            $.get("api/items/count", _.bind(this.render, this));
        },

        renderZoom: function(item) {
            // update browser title
            if(item.get("description")) {
                window.document.title = item.get("description") + ", " + WallBlog.title;
            }

            // render with description in header bar
            this.template = tmplZoom;
            this.item = item;
            HeaderView.__super__.render.apply(this, [{ "item": item.toJSON(), "admin": tools.isLogged() }]);

            if(tools.isLogged()) {
                this.$("span.delete").show();
            }
            else {
                this.$("span.delete").hide();
            }
        },

        renderEdit: function() {
            this.template = tmplEdit;
            HeaderView.__super__.render.apply(this, [{ "item": this.item.toJSON(), "admin": tools.isLogged() }]);
            this.$("input").focus();
        },
        
        login: function() {
            if(!tools.isLogged()) {
                Backbone.history.navigate('/login', true);
            }
        },
        
        upload: function() {
            if(!tools.isLogged()) {
                Backbone.history.navigate('/login', true);
            }
            else {
                new UploadVideoView();
            }
        },
        
        editDescription: function() {
            if(tools.isLogged()) {
                this.renderEdit();
            }
        },
        
        submitDescription: function(e) {
            if(tools.isLogged()) {
                // Enter
                if(e.keyCode === 13) {
                    this.item.set("description", this.$("input[name='description']").val());
                    this.item.save();
                    this.renderZoom(this.item);
                }
                // Escape
                else if(e.keyCode === 27) {
                    this.escapeDescription();
                }
            }
        },
        
        escapeDescription: function() {
            // force header to be rendered in normal mode
            this.item.trigger("change");
        },
        
        deletePicture: function() {
            if(window.confirm(labels.confirmDeletePicture)) {
                this.item.destroy();
                Backbone.history.navigate("/", true);
            }
        },

        saveFilter: function(monthId, year) {
            this.filter = {
                "year": year,
                "monthId": monthId
            };
        },

        clearFilter: function() {
            this.filter = null;
        }
    });
    return HeaderView;
});