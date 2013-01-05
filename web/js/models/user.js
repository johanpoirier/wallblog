define(['backbone'], function(Backbone) {
    var UserModel = Backbone.Model.extend({
        
        urlRoot: "/api/user"

    });
    return UserModel;
});